import { Request, Response, NextFunction } from "express";

const RemoveComingFrom = (_req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "production") {
    const originalJson = res.json;
    res.json = function (data) {
      if (data && typeof data === "object") {
        // Remove comingFrom property (shallow removal)
        const { comingFrom, ...cleanData } = data;
        return originalJson.call(this, cleanData);
      }
      return originalJson.call(this, data);
    };
  }
  next();
};

export { RemoveComingFrom };
