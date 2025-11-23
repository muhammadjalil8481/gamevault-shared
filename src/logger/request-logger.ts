import expressWinston from "express-winston";
import { Logger } from "winston";

const WinstonRequestLogger = (logger: Logger) => {
  return expressWinston.logger({
    winstonInstance: logger,
    meta: true, // log headers, body, query
    colorize: false,
    ignoreRoute: (_req) => false, // can ignore certain routes if needed
    level: function (_req, res) {
      if (res.statusCode >= 400) return "error";
      return "info";
    },
    format: logger.format,
    msg: (req, res) => {
      const body = Object.keys(req.body || {}).length
        ? `\nbody: ${JSON.stringify(req.body)}`
        : "";
      const query = Object.keys(req.query || {}).length
        ? `\nquery: ${JSON.stringify(req.query)}`
        : "";
      return `${req.method} ${res.statusCode} ${req.path}${query}${body}`;
    },
    dynamicMeta: (req, _res) => {
      return {
        type: "operational",
        source: "express-winston",
        reqId: req.requestId,
      };
    },
  });
};

export { WinstonRequestLogger };
