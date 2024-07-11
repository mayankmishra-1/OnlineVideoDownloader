import React, { useState } from "react";
import axios from "axios";
import FormatSelector from "./FormatSelector";

const VideoDownloader = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [formats, setFormats] = useState([]);
  const [uniqueFormats, setUniqueFormats] = useState([]);

  const handleGetFormats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/getFormats?url=${encodeURIComponent(videoUrl)}`
      );

      const mp4Formats = response.data.filter(
        (format) => format.container === "mp4"
      );

      const seenQualities = new Set();
      const uniqueMp4Formats = mp4Formats.filter((format) => {
        if (seenQualities.has(format.qualityLabel)) {
          return false;
        } else {
          seenQualities.add(format.qualityLabel);
          return true;
        }
      });

      setFormats(uniqueMp4Formats);
    } catch (error) {
      console.error("Error fetching formats:", error);
      alert("Error fetching formats");
    }
  };

  const handleDownloadVideo = async (format) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/youtubeDownloader",
        {
          url: videoUrl,
          format: format,
        },
        { responseType: "blob" } // Ensure the response is handled as a blob
      );
      console.log("Response headers:", response.headers);
      // Extract the filename from the Content-Disposition header
      const contentDisposition = response.headers["content-disposition"];
      let filename = "video.mp4"; // Default filename

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match.length === 2) {
          filename = match[1];
        }
      }

      console.log("Extracted filename:", filename);

      // Create a blob URL for the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // Use the extracted filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading video:", error);
      alert("Error downloading video");
    }
  };

  return (
    <div className="video-downloader">
      <h1>YouTube Downloader</h1>
      <input
        type="text"
        placeholder="Enter YouTube URL"
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

export default VideoDownloader;
