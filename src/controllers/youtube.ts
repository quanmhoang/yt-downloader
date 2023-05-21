import services from "../services";
import { logger, Response, statusCode } from "../utils";
import cp from "child_process";
const ffmpeg = require("ffmpeg-static");

const youtubeMP3DownloaderController = async (req: any, res: any) => {
    const url = req.query.url;

    try {
        logger.info(`Getting video info youtube url - ${url}`);
        if (!url) {
            return res
                .status(statusCode.BAD_REQUEST_400)
                .send(
                    Response.error(
                        "URL_QUERY_PARAM_REQUIRED",
                        "UrlQueryParamRequired",
                        "Url Query Param Required"
                    )
                );
        }
        const videoInfo = await services.youtubeService.getVideoInfo(url);
        if (!videoInfo) {
            return res
                .status(statusCode.BAD_REQUEST_400)
                .send(
                    Response.error(
                        "FAIL_TO_GET_VIDEO_INFO",
                        "FailToGetVideoInfo",
                        "Fail To Get Video Info"
                    )
                );
        }
        logger.info(`Download mp3 file youtube url - ${url}`);

        const result = services.youtubeService.getMP3Stream(
            url
        );

        res.header("Content-Disposition", `attachment;  filename=${videoInfo.videoDetails.videoId}.mp3`);
        result.pipe(res);

    } catch (error) {
        logger.error(
            `Error converting url - ${url}: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
        );
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR_500)
            .send(
                Response.error(
                    "internal_server_error",
                    "InternalServerError",
                    "Internal Server Error"
                )
            );
    }
};

const youtubeMP4DownloaderController = async (req: any, res: any) => {
    const url = req.query.url;
    try {
        logger.info(`Getting video info youtube url - ${url}`);
        if (!url) {
            return res
                .status(statusCode.BAD_REQUEST_400)
                .send(
                    Response.error(
                        "URL_QUERY_PARAM_REQUIRED",
                        "UrlQueryParamRequired",
                        "Url Query Param Required"
                    )
                );
        }
        const videoInfo = await services.youtubeService.getVideoInfo(url);
        if (!videoInfo) {
            return res
                .status(statusCode.BAD_REQUEST_400)
                .send(
                    Response.error(
                        "FAIL_TO_GET_VIDEO_INFO",
                        "FailToGetVideoInfo",
                        "Fail To Get Video Info"
                    )
                );
        }
        logger.info(`Download mp4 file youtube url - ${url}`);

        res.header("Content-Disposition", `attachment;  filename=${videoInfo.videoDetails.videoId}.mp4`);

        const video = services.youtubeService.getMP4Stream(
            url
        );
        const audio = services.youtubeService.getMP3Stream(
            url
        );

        const ffmpegProcess = cp.spawn(ffmpeg, [
            "-i", `pipe:3`,
            "-i", `pipe:4`,
            "-map", "0:v",
            "-map", "1:a",
            "-c:v", "copy",
            "-c:a", "libmp3lame",
            "-crf", "27",
            "-preset", "veryfast",
            "-movflags", "frag_keyframe+empty_moov",
            "-f", "mp4",
            "-loglevel", "error",
            "-"
        ], {
            stdio: [
                "pipe", "pipe", "pipe", "pipe", "pipe",
            ],
        });

        video.pipe(ffmpegProcess.stdio[3]);
        audio.pipe(ffmpegProcess.stdio[4]);
        ffmpegProcess.stdio[1].pipe(res);

        let ffmpegLogs = "";

        ffmpegProcess.stdio[2].on(
            "data",
            (chunk) => {
                ffmpegLogs += chunk.toString();
            }
        );

        ffmpegProcess.on(
            "exit",
            (exitCode) => {
                if (exitCode === 1) {
                    console.error(ffmpegLogs);
                }
            }
        );

    } catch (error) {
        logger.error(
            `Error converting url - ${url}: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
        );
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR_500)
            .send(
                Response.error(
                    "internal_server_error",
                    "InternalServerError",
                    "Internal Server Error"
                )
            );
    }
};

export default {
    youtubeMP3DownloaderController,
    youtubeMP4DownloaderController
};
