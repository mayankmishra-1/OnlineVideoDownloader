import express from 'express';
import fs from 'fs';
import ytdl from 'ytdl-core'

const app=express();


const getFormats = async (req, res) => {
  const videoUrl = req.query.url;
  try {
    const info = await ytdl.getInfo(videoUrl);
    const formats = info.formats.map((format) => ({
      qualityLabel: format.qualityLabel,
      format: format.itag,
      container: format.container,
      type: format.mimeType,
    }));
    res.json(formats);
  } catch (error) {
    res.status(500).send("Error fetching formats");
  }
};


const youtubeDownloader=((req, res) => {
  const { url, format } = req.body;
  const outputFilePath = "video.mp4";

  ytdl(url, { quality: format })
    .on("error", (err) => {
      console.error("Error downloading video:", err);
      res.status(500).send("Error downloading video");
    })
    .pipe(fs.createWriteStream(outputFilePath))
    .on("finish", () => {
      res.download(outputFilePath);
    });
});

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
export {youtubeDownloader}