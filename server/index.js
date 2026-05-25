const express = require('express');
const cors = require('cors');
const https = require('https');
const app = express();

app.use(cors());
app.use(express.json());

// Paste your copied YouTube API key here
const YOUTUBE_API_KEY = "AIzaSyBu5Nf92q96wyGW6ARsy5COkQmNM77mMew";

// Helper function to extract the 11-character Video ID from any YouTube URL
function extractVideoId(url) {
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
}

app.post('/analyze', (req, res) => {
  const { url } = req.body;
  const videoId = extractVideoId(url);

  if (!videoId) {
    return res.status(400).json({ error: "Invalid YouTube URL provided." });
  }

  // Target the official Google API endpoint for video metadata
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails`;

  https.get(apiUrl, (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => data += chunk);
    
    apiRes.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (!json.items || json.items.length === 0) {
          return res.status(404).json({ error: "Video not found or is private." });
        }

        const videoData = json.items[0];
        const title = videoData.snippet.title;
        
        // YouTube API returns duration in ISO 8601 format (e.g., "PT44M12S")
        const isoDuration = videoData.contentDetails.duration;
        
        // Parse ISO duration into raw minutes
        const minutesMatch = isoDuration.match(/(\d+)M/);
        const hoursMatch = isoDuration.match(/(\d+)H/);
        
        let durationMins = 0;
        if (hoursMatch) durationMins += parseInt(hoursMatch[1]) * 60;
        if (minutesMatch) durationMins += parseInt(minutesMatch[1]);
        if (durationMins === 0) durationMins = 1; // Fallback for short videos

        // Return a clean payload back to your React frontend
        res.json({
          title: title,
          durationMins: durationMins,
          resolution: '1080p', // Core fallback matching your baseline matrix
          bitrateKbps: 4500    // Matches your 4.50 GB/hour computational rule
        });

      } catch (parseError) {
        res.status(500).json({ error: "Failed to parse API data." });
      }
    });
  }).on('error', (e) => {
    res.status(500).json({ error: "Google API connection error." });
  });
});

// Dynamic port configuration for cloud host environments
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Authorized API Analyzer Server running on port ${PORT}`);
});