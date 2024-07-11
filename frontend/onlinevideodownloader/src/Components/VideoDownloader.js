import React, { useState } from "react";
import axios from "axios";
import FormatSelector from "./FormatSelector";

const VideoDownloader = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [formats, setFormats] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState("");

  const handleGetFormats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/getFormats?url=${encodeURIComponent(videoUrl)}`
      );

      const { formats, thumbnail, title } = response.data;

      const mp4Formats = formats.filter((format) => format.container === "mp4");

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
      setThumbnail(thumbnail);
      setTitle(title);
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
          format: format.format,
        },
        { responseType: "blob" }
      );

      // Handle file download here
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
          thumbnail={thumbnail}
          title={title}
        />
      )}
    </div>
  );
};

export default VideoDownloader;
