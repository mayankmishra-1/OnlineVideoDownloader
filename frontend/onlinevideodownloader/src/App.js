import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header.js";
import VideoDownloader from "./Components/VideoDownloader.js";
import InstagramReelsDownloader from "./Components/InstagramReelsDownloader.js";



function App() {
  const [activeDownloader, setActiveDownloader] = useState("youtube"); // Default to YouTube

  const toggleDownloader = (downloader) => {
    setActiveDownloader(downloader);
  };
  return (
    <Router>
      <Header title="Online Video Downloader" />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/youtube" element={<VideoDownloader />} />
          <Route path="/instagram" element={<InstagramReelsDownloader />} />
        </Routes>
      </div>
    </Router>
  );
}

const HomePage = () => (
  <div>
    {/* Home Page Content */}
    <Link to="/youtube" className="btn-primary">
      Download YouTube Video
    </Link>
    <Link to="/instagram" className="btn-success">
      Download Instagram Reels
    </Link>
  </div>
);

export default App;
