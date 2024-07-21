import express from "express";
import {
  getFormats,
  youtubeDownloader,
  getInstagramFormats,
  downloadInstagramReel,
} from "../controllers/downloadController.js";

const app = express();
const router = express.Router();

router.route("/youtubeDownloader").post(youtubeDownloader);
router.route("/getFormats").get(getFormats);
router.route("/getInstagramFormats").get(getInstagramFormats);
router.route("/downloadInstagramReel").post(downloadInstagramReel);

export default router;
