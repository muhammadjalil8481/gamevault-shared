import { Request, Response, NextFunction } from "express";
import { isHttpError } from "http-errors";
import { Logger } from "winston";

const GlobalErrorHandler = (logger: Logger) => {
  return (err: any, _req: Request, res: Response, _next: NextFunction) => {
    try {
      const statusCode = isHttpError(err) ? err.status : 500;
      const message = isHttpError(err) ? err.message : "Something went wrong";
      const isOperational = Boolean(err?.type === "operational");
      const comingFrom = err?.comingFrom || "Global Error Handler";
      const type = isOperational ? "Operational" : "Error";

      if (!isOperational) {
        logger.error(err);
      }

      res.status(statusCode).json({
        status: "failed",
        message: message,
        comingFrom,
        type,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: "Something Went Wrong",
        comingFrom: "Global Error Handler Catch Block",
      });
    }
  };
};

export { GlobalErrorHandler };
