import fs from "fs";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ForbiddenException } from "../errors";

const PUBLIC_KEY = fs.readFileSync("./public.pem", "utf-8");

export function verifyGatewayToken(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers["x-gateway-token"] as string;
    if (!token) {
      throw ForbiddenException({
        msg: "Access Denied",
        comingFrom:
          "middlewares/verify-gateway-token.ts verify verifyGatewayToken()",
      });
    }

    const decodedToken = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    }) as { src: string };

    if (decodedToken?.src !== "gateway") {
      throw ForbiddenException({
        msg: "Access Denied",
        comingFrom:
          "middlewares/verify-gateway-token.ts verify verifyGatewayToken()",
      });
    }
    next();
  } catch (error) {
    throw ForbiddenException({
      msg: "Access Denied",
      comingFrom:
        "middlewares/verify-gateway-token.ts verify verifyGatewayToken()",
    });
  }
}
