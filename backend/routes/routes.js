import express from 'express';
import { getFormats, youtubeDownloader } from "../controllers/downloadController.js";

const app=express();
const router=express.Router();

router.route('/youtubeDownloader').post(youtubeDownloader);
router.route('/getFormats').get(getFormats)

export default router
