import Redis from "ioredis";
import { Logger } from "winston";

let redis: Redis | null = null;

async function connectRedis(
  logger: Logger,
  data: {
    host: string;
    port: number;
    password: string;
  },
  comingFrom?: string
): Promise<void> {
  try {
    redis = new Redis({
      host: data.host,
      port: data.port,
      password: data.password,
    });

    // Wait until connection is ready
    await new Promise<void>((resolve, reject) => {
      redis!.on("connecting", () => {
        logger.info("Connecting to redis", {
          comingFrom,
        });
      });

      redis!.once("ready", () => {
        logger.info("✅ Redis connected", {
          comingFrom,
        });
        resolve();
      });

      redis!.once("error", (err) => {
        reject(err);
      });
    });
  } catch (error) {
    logger.error("Failed to connect to redis", {
      comingFrom,
      error,
    });
    throw error;
  }
}

function getRedis(): Redis {
  if (!redis)
    throw new Error("Redis not connected yet. Call connectRedis() first.");
  return redis;
}

export { connectRedis, getRedis };
