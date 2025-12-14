import axios from "axios";
import { getRedis } from "../redis";
import { Request, Response, NextFunction } from "express";
import { InternalServerException } from "../errors";

const CheckPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const redisInstance = getRedis();
    let permissionsList = await redisInstance.get("role_permissions");
    if (!permissionsList) {
      const response = await axios.get(
        `${process.env.USERS_SERVICE_URL}/api/v1/roles/role-permissions`
      );
      const result = response?.data?.data;
      if (!result)
        throw InternalServerException({
          msg: "Something Went Wrong!",
          comingFrom: "CheckPermission() middleware",
          reqId: req.requestId,
        });
      permissionsList = result;
    }

  };
};
