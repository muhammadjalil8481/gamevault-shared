import { Request, Response, NextFunction } from "express";

export const RequestQueryWrite = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  Object.defineProperty(req, "query", {
    ...Object.getOwnPropertyDescriptor(req, "query"),
    value: { ...req.query },
    writable: true,
  });
  next();
};
