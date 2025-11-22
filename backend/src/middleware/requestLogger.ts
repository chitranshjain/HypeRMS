import { logger } from "../lib/logger";
import { NextFunction, Request, Response } from "express";

const requestLoggerMiddleware = (req: Request, res: any, next: NextFunction) => {
    const oldSend = res.send;
    res.send = (async (responseBody: any) => {
        const originalUrl = req.originalUrl;
        const method = req.method;
        const status = res.statusCode;
        const responseTime = res.get('response-time');
        const requestHeaders = req.headers;
        const responseHeaders = res.getHeaders();
        const requestBody = req.body;
        const requestParams = req.params;
        const requestQuery = req.query;

        const logObject = {
            originalUrl,
            method,
            status,
            responseTime,
            requestHeaders,
            responseHeaders,
            requestBody,
            responseBody,
            requestParams,
            requestQuery
        }

        logger.log(logger.LOG_LEVELS.INFO, JSON.stringify(logObject), 'request.log');
        oldSend.call(res, responseBody);
    });

    next();
};

export default requestLoggerMiddleware;