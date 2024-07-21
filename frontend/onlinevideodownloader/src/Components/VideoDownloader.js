import React, { useState } from "react";
import axios from "axios";
import FormatSelector from "./FormatSelector";

const VideoDownloader = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [formats, setFormats] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState("");

  const handleGetFormats = async () => {
    if (!videoUrl) {
      alert("Please enter a link");
    }
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

  //hadnle video before status check
  // const handleDownloadVideo = async (format) => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8000/youtubeDownloader",
  //       {
  //         url: videoUrl,
  //         format: format.format,
  //       },
  //       { responseType: "blob" }
  //     );

  //     // Handle file download here
  //   } catch (error) {
  //     console.error("Error downloading video:", error);
  //     alert("Error downloading video");
  //   }
  // };
  const handleDownloadVideo = async (format) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/youtubeDownloader",
        {
          url: videoUrl,
          format: format.format,
        },
        { responseType: "blob", headers: { Accept: "application/json" } }
      );

      // Extract filename from Content-Disposition header
      const disposition = response.headers["content-disposition"];
      const filename = disposition
        ? disposition.split("filename=")[1].replace(/"/g, "")
        : "video.mp4";

      // Handle file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading video:", error);
      if (error.response && error.response.data) {
        const reader = new FileReader();
        reader.onload = function () {
          alert(`Error downloading video: ${reader.result}`);
        };
        reader.readAsText(error.response.data);
      } else {
        alert("Error downloading video");
      }
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
