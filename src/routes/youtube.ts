import * as express from "express";
import config from "../../config";
import controller from "../controllers";
import middleware from "../middlewares";

const router = express.Router();

router.get(
    "/" + config["apiVersion"] + "/yt/convert/mp3",
    middleware.defaultMiddleware,
    middleware.apiKeyAuthentication,
    controller.youtubeDownloaderController.youtubeMP3DownloaderController
);

router.get(
    "/" + config["apiVersion"] + "/yt/convert/mp4",
    middleware.defaultMiddleware,
    middleware.apiKeyAuthentication,
    controller.youtubeDownloaderController.youtubeMP4DownloaderController
);



export default router;
