import express from "express";
import tyboost from "tyboost";
import * as bodyParser from "body-parser";
import * as listEndpoints from "express-list-endpoints";
import * as Table from "cli-table";

import allRouter from "../routes";
import { logger, constants } from "../utils";

// initialise express app with tyboost - https://www.npmjs.com/package/tyboost
logger.info(`BOOT :: App is starting with environment :: ${constants.ENV}`);
logger.info(`BOOT :: Initialising express app with tyboost`);
const app = tyboost(express());



const cookieParser = require("cookie-parser");

// register application level middleware
const registerCoreMiddleware = function (): void {
    try {
        logger.info(`BOOT :: Registering core middleware started`);

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        logger.info(`BOOT :: Registered middleware : bodyParser`);

        app.use(cookieParser());
        logger.info(`BOOT :: Registered middleware : cookieParser`);

        app.use(express.static(__dirname + "\\static"));
        app.use("/static", express.static("./static"));

        logger.info(`BOOT :: Registering core middleware done`);
    } catch (err) {
        logger.error(`BOOT :: Error while registering core middleware . Check core middleware : ${JSON.stringify(err.message)}`);
    }
};

// register all routes in routes/index
const registerRoutes = (routers: object): void => {
    try {
        if (Object.keys(routers) && Object.keys(routers).length) {
            logger.info(`BOOT :: Registering routes started`);
            Object.keys(routers).forEach(key => {
                app.use("/", routers[key]);
            });
            // print the routes in console
            logger.info(`BOOT :: Registered following routes`);
            const table = new Table({ head: ["", "Path"] });
            listEndpoints(app).forEach(route => {
                if (route.path != "*") {
                    const row = {};
                    row[`${route.methods.join(", ")}`] = route.path;
                    table.push(row);
                }
            });
            logger.info(`\n${table.toString()}`);
            logger.info("BOOT :: Registering routes done");
        }
    } catch (err) {
        logger.error(`BOOT :: Error while registering routes. Check routes : ${JSON.stringify(err.message)}`);
    }
};

const handleError = (): void => {
    process.on("uncaughtException", function (err) {
        logger.error(`UNCAUGHT_EXCEPTION OCCURRED : ${JSON.stringify(err.stack)}`);
        process.exit(1);
    });
};

const handleAppListenError = (error: any) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.error(
                `BOOT :: ${constants.HOST}:${constants.PORT} requires elevated privileges`
            );
            process.exit(1);
            break;
        case "EADDRINUSE":
            logger.error(
                `BOOT :: ${constants.HOST}:${constants.PORT} is already in use`
            );
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// start application
const startApp = async (): Promise<void> => {
    try {
        // register core application level middleware
        registerCoreMiddleware();
        // register routes
        registerRoutes(allRouter ? allRouter : {});
        await app.boot();
        logger.info(`BOOT :: Booting application done`);

        app.listen(constants.PORT, constants.HOST)
            .on("error", handleAppListenError)
            .on("listening", () => {
                logger.info(
                    `BOOT :: <> <> <> <> <> <> <> <> <> <> Listening on ${constants.HOST}:${constants.PORT} <> <> <> <> <> <> <> <> <> <>`
                );
            });

        // exit on uncaught exception
        handleError();
    } catch (err) {
        logger.error(`BOOT :: Error while booting application from boot script : ${JSON.stringify(err)}`);
        throw err;
    }
};

export default startApp;
