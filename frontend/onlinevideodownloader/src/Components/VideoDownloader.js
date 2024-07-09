import React, { useState } from "react";
import axios from "axios";
import FormatSelector from "./FormatSelector";

const VideoDownloader = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState("");

  const handleGetFormats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/getFormats?url=${encodeURIComponent(videoUrl)}`
      );
      setFormats(response.data);
    } catch (error) {
      console.error("Error fetching formats:", error);
      alert("Error fetching formats");
    }
  };

  const handleDownloadVideo = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/youtubeDownloader",
        { url: videoUrl, format: selectedFormat },
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "video.mp4");
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
        <FormatSelector formats={formats} onSelectFormat={setSelectedFormat} />
      )}

      {selectedFormat && (
        <button onClick={handleDownloadVideo} className="btn-success">
          Download
        </button>
      )}
    </div>
  );
};

export default VideoDownloader;
