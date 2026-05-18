// // server/index.js
// const express = require('express');
// const { exec } = require('child_process');
// const cors = require('cors');
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.post('/analyze', (req, res) => {
//   const { url } = req.body;

//   // -j tells yt-dlp to output JSON. --flat-playlist ensures we don't download everything.
//   const command = `yt-dlp -j --flat-playlist "${url}"`;

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error: ${error.message}`);
//       return res.status(500).json({ error: "Could not analyze the link." });
//     }

//     try {
//       const data = JSON.parse(stdout);
      
//       // We extract only what we need for your carbon logic
//       res.json({
//         title: data.title,
//         durationMins: Math.round(data.duration / 60) || 0,
//         // yt-dlp returns 'height' for resolution (e.g., 1080)
//         resolution: data.height ? `${data.height}p` : '1080p',
//         // tbr is total bitrate in kbps
//         bitrateKbps: data.tbr || 0 
//       });
//     } catch (parseError) {
//       res.status(500).json({ error: "Failed to parse video data." });
//     }
//   });
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Analyzer Server running on http://localhost:${PORT}`));
// server/index.js
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core-mp4'); // Native Node package, no system installation needed!
const app = express();

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    // Fetch video information directly through native JS streams
    const info = await ytdl.getInfo(url);
    const details = info.videoDetails;

    // Convert seconds to rounded minutes
    const durationMins = Math.round(parseInt(details.lengthSeconds) / 60) || 0;

    // Send the cleanly parsed payload back to your React frontend
    res.json({
      title: details.title,
      durationMins: durationMins,
      resolution: '1080p', // Default fallback for your profile matrix
      bitrateKbps: 4500    // Aligns with your YouTube 4.50 GB/hour baseline
    });

  } catch (error) {
    console.error(`Scraping Error: ${error.message}`);
    res.status(500).json({ error: "Could not analyze the link over cloud hosting." });
  }
});

// Cloud port binding fix for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Analyzer Server running perfectly on port ${PORT}`);
});