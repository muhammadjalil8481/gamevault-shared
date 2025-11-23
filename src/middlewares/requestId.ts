import { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";

const RequestId = (req: Request, res: Response, next: NextFunction) => {
  const idFromClient = req.headers["x-request-id"] as string;

  const requestId = idFromClient || uuid();
  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  next();
};

export { RequestId };
