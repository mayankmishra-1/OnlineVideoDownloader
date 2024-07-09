import './App.css';
import Header from './Components/Header.js'
import VideoDownloader from './Components/VideoDownloader.js';



function App() {
  return (
    // <div className="App">

    // </div>
    <>
      <Header title="Online Video Downloader" />
      <div className="app-container">
        <VideoDownloader />
      </div>
    </>
  );
}

export default App;
