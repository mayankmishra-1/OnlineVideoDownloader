import React, { useState } from "react";
import axios from "axios";
import FormatSelector from "./FormatSelector";

const InstagramReelsDownloader = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [formats, setFormats] = useState([]);

  const handleGetFormats = async () => {
    try {
      // Implement logic to fetch Instagram reels formats
      const response = await axios.get(
        `http://localhost:8000/instagram/getFormats?url=${encodeURIComponent(
          videoUrl
        )}`
      );
      setFormats(response.data.formats);
    } catch (error) {
      console.error("Error fetching formats:", error);
      alert("Error fetching formats");
    }
  };

  const handleDownloadVideo = async (format) => {
    try {
      // Implement logic to download Instagram reel
      const response = await axios.post(
        "http://localhost:8000/instagram/download",
        {
          url: videoUrl,
          format: format,
        },
        { responseType: "blob" }
      );
      // Handle download logic
    } catch (error) {
      console.error("Error downloading video:", error);
      alert("Error downloading video");
    }
  };

  return (
    <div className="instagram-reels-downloader">
      <h1>Instagram Reels Downloader</h1>
      <input
        type="text"
        placeholder="Enter Instagram Reels URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="input-url"
      />
      <button onClick={handleGetFormats} className="btn-primary">
        Get Formats
      </button>

      {formats.length > 0 && (
        <FormatSelector
          formats={formats}
          onSelectFormat={handleDownloadVideo}
        />
      )}
    </div>
  );
};

export default InstagramReelsDownloader;
