// types.d.ts
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    currentUser?: string | JwtPayload
  }
}
