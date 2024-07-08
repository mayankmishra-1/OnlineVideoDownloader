import express from 'express';
import { youtubeDownloader } from "../controllers/downloadController.js";

const app=express();
const router=express.Router();

router.route('/youtubeDownloader').get(youtubeDownloader);

export default router
