import express from "express";
import fs from "fs";
import ytdl from "ytdl-core";
import instaFetcher from "insta-fetcher";
import axios from "axios";
import cheerio from "cheerio";


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
  console.log("Requested format:", format);

  const sanitizeFilename = (name) => {
    return name.replace(/[^a-zA-Z0-9-_ .]/g, "_");
  };

  try {
    const videoInfo = await ytdl.getInfo(url);
    const videoTitle = sanitizeFilename(videoInfo.videoDetails.title);
    console.log("Video title:", videoTitle);
    const fileExtension = "mp4";

    res.header(
      "Content-Disposition",
      `attachment; filename="${videoTitle}.${fileExtension}"`
    );

    ytdl(url, { quality: format })
      .on("response", (response) => {
        if (response.statusCode !== 200) {
          res
            .status(response.statusCode)
            .send("Authorization Declined by YouTube");
          console.error("Error downloading video:", response.statusCode);
        }
      })
      .on("error", (err) => {
        if (!res.headersSent) {
          res.status(500).send("Authorization Declined by YouTube");
        }
        console.error("Error downloading video:", err);
      })
      .pipe(res);
  } catch (error) {
    console.error("Error downloading video:", error);
    if (!res.headersSent) {
      res.status(500).send("Error downloading video");
    }
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

const getInstagramFormats = async (req, res) => {
  const reelUrl = req.query.url;
  console.log(reelUrl);

  try {
    const response = await axios.get(reelUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const videoUrl = $("meta[property='og:video']").attr("content");

    if (!videoUrl) {
      throw new Error("Video URL not found");
    }

    res.json({ videoUrl });
  } catch (error) {
    console.error("Error fetching Instagram Reel URL:", error);
    res.status(500).send("Error fetching Instagram Reel URL");
  }
};

const downloadInstagramReel = async (req, res) => {
  const { url } = req.body;
  try {
    res.header("Content-Disposition", `attachment; filename="reel.mp4"`);
    const response = await axios.get(url, { responseType: "stream" });
    response.data.pipe(res);
  } catch (error) {
    console.error("Error downloading Instagram Reel:", error);
    res.status(500).send("Error downloading Instagram Reel");
  }
};

export { getFormats, youtubeDownloader, getInstagramFormats, downloadInstagramReel };
