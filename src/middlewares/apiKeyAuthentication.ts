import { logger, Response, statusCode } from "../utils";
import config from "../../config";

const apiKeyAuthentication = (req, res, next) => {
    try {
        const apiKey = req.headers["x-api-key"];
        if (apiKey !== config.apiKey) {
            return res
                .status(statusCode.BAD_REQUEST_400)
                .send(Response.error("wrong_apiKey", "WrongApiKey", "the api key is wrong"));
        }

        next();
    } catch (err) {
        logger.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
        return res.status(statusCode.UNAUTHORIZED_401).send();
    }
};

export default apiKeyAuthentication;
