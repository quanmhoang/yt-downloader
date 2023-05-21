/**
 * For  response structure
 * We have add general response format as per our need and it works
 * Change as per the application, team and company need
 * // TODO : add json.api implementation for node js specified at https://jsonapi.org/implementations/#server-libraries-node-js
 */
class Response {
    public static success(data: object, next?: string): object {
        // add data
        const successResponseObject = {
            status: "success",
            data: data,
        };

        // add next to response if provided
        if (next && typeof next === "string") {
            successResponseObject["next"] = next;
        }

        return successResponseObject;
    }

    public static error(code: string, title: string, detail?: string, optionals?: object): object {
        // add data
        const errorResponseObject = {
            code: code,
            title: title,
            ...optionals,
        };

        // add next to response if provided
        if (detail && typeof detail === "string") {
            errorResponseObject["detail"] = detail;
        }
        return {
            status: "error",
            errors: [errorResponseObject],
        };
    }

    public static errors(errorObject: Array<object>): object {
        const errorsResponseObject: Array<object> = [];

        if (errorObject && errorObject.length > 0) {
            errorObject.forEach((obj) => {
                const errorObj = {
                    ...obj
                };
                errorsResponseObject.push({
                    ...errorObj
                });
            });
        }

        return {
            errors: errorsResponseObject
        };
    }
}

/**
 * Status Code for responses
 */
const statusCode  = {
     OK_200: 200,
     CREATED_201: 201,
     ACCEPTED_202: 202,
     NO_CONTENT_204: 204,
     NOT_MODIFIED_304: 304,
     BAD_REQUEST_400: 400,
     UNAUTHORIZED_401: 401,
     FORBIDDEN_403: 403,
     NOT_FOUND_404: 404,
     METHOD_NOT_ALLOWED_405: 405,
     REQUEST_TIME_OUT_408: 408,
     PAYLOAD_TOO_LARGE_413: 413,
     TOO_EARLY_425: 425,
     TOO_MANY_REQUESTS_429: 429,
     UNAVAILABLE_FOR_LEGAL_REASONS_451: 451,
     INTERNAL_SERVER_ERROR_500: 500,
     NOT_IMPLEMENTED_501: 501,
     SERVICE_UNAVAILABLE_503: 503,
};

export { Response, statusCode };
