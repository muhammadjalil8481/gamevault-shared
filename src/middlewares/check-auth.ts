import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../errors";

export const checkAuthentication = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const comingFrom = "checkAuthentication() middleware";
  try {
    const userHeader = req.headers["x-user"] as string;
    if (!userHeader)
      throw UnauthorizedException({
        msg: "Access Denied",
        reqId: req.requestId,
        comingFrom,
      });
    req.currentUser = JSON.parse(userHeader);
    next();
  } catch (error) {
    throw UnauthorizedException({
      msg: "Access Denied",
      reqId: req.requestId,
      comingFrom,
    });
  }
};
