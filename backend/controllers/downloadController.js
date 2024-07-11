import express from "express";
import fs from "fs";
import ytdl from "ytdl-core";

const app = express();

const getFormats = async (req, res) => {
  const videoUrl = req.query.url;
  // console.log(videoUrl);
  try {
    const info = await ytdl.getInfo(videoUrl);
    // console.log(info.formats);
    const formats = info.formats.map((format) => ({
      qualityLabel: format.qualityLabel,
      format: format.itag,
      container: format.container,
      type: format.mimeType,
      size: format.contentLength
        ? (format.contentLength / (1024 * 1024)).toFixed(2) + " MB"
        : "N/A",
    }));
    const thumbnail = info.videoDetails.thumbnails[1].url;
    const title = info.videoDetails.title;
    res.json({formats, thumbnail, title});
  } catch (error) {
    res.status(500).send("Error fetching formats");
  }
};

//api to download to server first then send
// const youtubeDownloader=((req, res) => {
//   const { url, format } = req.body;
//   const outputFilePath = "video.mp4";

//   ytdl(url, { quality: format })
//     .on("error", (err) => {
//       console.error("Error downloading video:", err);
//       res.status(500).send("Error downloading video");
//     })
//     .pipe(fs.createWriteStream(outputFilePath))
//     .on("finish", () => {
//       res.download(outputFilePath);
//     });
// });

const youtubeDownloader = async (req, res) => {
  const { url, format } = req.body;
  console.log(format);
  const sanitizeFilename = (name) => {
    return name.replace(/[^a-zA-Z0-9-_ .]/g, "_");
  };

  try {
    const videoInfo = await ytdl.getInfo(url);
    const videoTitle = sanitizeFilename(videoInfo.videoDetails.title);
    console.log(videoTitle);
    const fileExtension = "mp4";

    res.header("Content-Disposition", `attachment; filename="${videoTitle}"`);
    ytdl(url, { quality: format })
      .on("error", (err) => {
        console.error("Error downloading video:", err);
      })
      .pipe(res);
    console.log(
      "Content-Disposition",
      `attachment; filename="${videoTitle}.${fileExtension}"`
    );
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).send("Error downloading video");
  }
};

// const videoUrl ="https://www.youtube.com/watch?v=weIrv6WbIec&list=PLTtZ8XLMT18H7aPMXMgGCSutVk_m2fgLC&index=5";
// const outputFilePath='Video.mp4'
// // const formatCode='22'
// const quality ='lowest'

// const youtubeDownloader=((req,res)=>{
//     ytdl(videoUrl, { quality: quality })
//       .on("error", (err) => {
//         console.error("Error downloading video:", err);
//       })
//       .pipe(fs.createWriteStream(outputFilePath))
//       .on("finish", () => {
//         console.log(`Video downloaded successfully to ${outputFilePath}`);
//         res.send("Downloaded!");
//       });
// })
export { getFormats, youtubeDownloader };
