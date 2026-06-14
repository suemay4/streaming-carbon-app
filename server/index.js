const express = require('express');
const cors = require('cors');
const https = require('https');
const { Pool } = require('pg'); // 1. Swapped mysql2 for pg
const app = express();

app.use(cors());
app.use(express.json());

// 2. Configure Environment-Aware Database Connection Pool
const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgresql_streaming_carbon_app_user:Ch7bbQSb1cKJebq7ZlUIU2k9W8w0rsXV@dpg-d8n1tajtqb8s73cm9cjg-a.singapore-postgres.render.com/postgresql_streaming_carbon_app",
  ssl: { rejectUnauthorized: false } // Required for cloud networks
});

// Automatically creates the tables on Render bootup
(async () => {
  try {
    const client = await dbPool.connect();
    console.log("🍃 Connected to Render PostgreSQL Engine. Verifying schemas...");

    // Build Traffic Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS traffic (
          id SERIAL PRIMARY KEY,
          metric_name VARCHAR(50) UNIQUE DEFAULT 'total_landings',
          count INT DEFAULT 0
      );
    `);

    // Seed traffic default row if it's empty
    await client.query(`
      INSERT INTO traffic (metric_name, count) 
      VALUES ('total_landings', 0)
      ON CONFLICT (metric_name) DO NOTHING;
    `);

    // Build Calculations Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS calculations (
          id SERIAL PRIMARY KEY,
          region VARCHAR(30) CHECK (region IN ('Peninsular Malaysia', 'Sabah', 'Sarawak')) NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      ALTER TABLE calculations 
      ADD COLUMN IF NOT EXISTS total_emissions NUMERIC(10, 2) DEFAULT 0.00;
    `);

    console.log("BitLeaf Cloud Tables Verified & Created Successfully.");
    client.release();
  } catch (err) {
    console.error("Database schema auto-build skipped/failed:", err.message);
  }
})();

const YOUTUBE_API_KEY = "AIzaSyBu5Nf92q96wyGW6ARsy5COkQmNM77mMew";

function extractVideoId(url) {
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
}

/**
 * DATABASE HOOK 1: Page Landing Tracker (PostgreSQL Upsert syntax)
 */
app.post('/api/analytics/landing', async (req, res) => {
  try {
    const updateQuery = `
      INSERT INTO traffic (metric_name, count) VALUES ('total_landings', 1)
      ON CONFLICT (metric_name) DO UPDATE SET count = traffic.count + 1
    `;
    await dbPool.query(updateQuery);
    
    const result = await dbPool.query("SELECT count FROM traffic WHERE metric_name = 'total_landings'");
    res.status(200).json({ success: true, current_views: result.rows[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log traffic metrics" });
  }
});

/**
 * DATABASE HOOK 2: Fetch Summary Stats (PostgreSQL types parsed to Int)
 */
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const trafficRes = await dbPool.query("SELECT count FROM traffic WHERE metric_name = 'total_landings'");
    const totalViews = trafficRes.rows.length > 0 ? trafficRes.rows[0].count : 0;

    const countRes = await dbPool.query("SELECT COUNT(*) as total FROM calculations");
    const totalCalculations = parseInt(countRes.rows[0].total || 0);

    const regionalRes = await dbPool.query("SELECT region, COUNT(*) as count FROM calculations GROUP BY region");
    
    const regionalBreakdown = { peninsular: 0, sabah: 0, sarawak: 0 };
    regionalRes.rows.forEach(row => {
      if (row.region === 'Peninsular Malaysia') regionalBreakdown.peninsular = parseInt(row.count);
      if (row.region === 'Sabah') regionalBreakdown.sabah = parseInt(row.count);
      if (row.region === 'Sarawak') regionalBreakdown.sarawak = parseInt(row.count);
    });

    const emissionsRes = await dbPool.query(`
      SELECT region, COALESCE(SUM(total_emissions), 0) as total_grams 
      FROM calculations 
      GROUP BY region
    `);

    const regionalEmissions = { peninsular: 0, sabah: 0, sarawak: 0 };
    emissionsRes.rows.forEach(row => {
      if (row.region === 'Peninsular Malaysia') regionalEmissions.peninsular = parseFloat(row.total_grams);
      if (row.region === 'Sabah') regionalEmissions.sabah = parseFloat(row.total_grams);
      if (row.region === 'Sarawak') regionalEmissions.sarawak = parseFloat(row.total_grams);
    });

    res.status(200).json({ totalViews, totalCalculations, regionalBreakdown });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard metrics" });
  }
});

/**
 * UPDATED /ANALYZE ROUTE
 */
app.post('/analyze', (req, res) => {
  const { url, region } = req.body;
  const videoId = extractVideoId(url);

  if (!videoId) {
    return res.status(400).json({ error: "Invalid YouTube URL provided." });
  }

  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails`;

  https.get(apiUrl, (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => data += chunk);
    
    apiRes.on('end', async () => {
      try {
        const json = JSON.parse(data);
        if (!json.items || json.items.length === 0) {
          return res.status(404).json({ error: "Video not found or is private." });
        }

        const videoData = json.items[0];
        const title = videoData.snippet.title;
        const isoDuration = videoData.contentDetails.duration;
        
        const minutesMatch = isoDuration.match(/(\d+)M/);
        const hoursMatch = isoDuration.match(/(\d+)H/);
        
        let durationMins = 0;
        if (hoursMatch) durationMins += parseInt(hoursMatch[1]) * 60;
        if (minutesMatch) durationMins += parseInt(minutesMatch[1]);
        if (durationMins === 0) durationMins = 1;

        if (region) {
          try {
            const targetEmissions = totalEmissions || 0.00;
            // PostgreSQL bindings use $1 placeholder syntax
            await dbPool.query("INSERT INTO calculations (region, total_emissions) VALUES ($1, $2)", [region, targetEmissions]);
          } catch (dbErr) {
            console.error("Database logging error:", dbErr.message);
          }
        }

        res.json({
          title: title,
          durationMins: durationMins,
          resolution: '1080p',
          bitrateKbps: 4500
        });

      } catch (parseError) {
        res.status(500).json({ error: "Failed to parse API data." });
      }
    });
  }).on('error', (e) => {
    res.status(500).json({ error: "Google API connection error." });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Cloud Pipeline Server active on port ${PORT}`);
});