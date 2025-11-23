import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import colors from "./colors";
import { ConsoleTransportInstance } from "winston/lib/winston/transports";

const { combine, timestamp, json, errors, printf } = format;

const indent = (text: string, spaces = 4) =>
  text
    .split("\n")
    .map((line) => " ".repeat(spaces) + line)
    .join("\n");

function getCustomLevel(
  level: string,
  type?: string,
  shouldColorize: boolean = false,
  source?: string
) {
  // Helper to wrap text with background + bold white + small padding
  const colorBlock = (text: string, bgColor: string, pad = 1) => {
    const paddedText = " ".repeat(pad) + text + " ".repeat(pad);
    return `${bgColor}${colors.FG_BOLD_WHITE}${paddedText}${colors.RESET}`;
  };

  if (shouldColorize) {
    if (source === "express-winston" && level.includes("info"))
      return colorBlock("REQUEST INFO", colors.BG_CYAN);
    if (source === "express-winston" && level.includes("error"))
      return colorBlock("REQUEST ERROR", colors.BG_MAGENTA);
    if (level.includes("info")) return colorBlock("INFO", colors.BG_GREEN);
    if (level.includes("error") && type === "operational")
      return colorBlock("OPERATIONAL ERROR", colors.BG_YELLOW);
    if (level.includes("error")) return colorBlock("ERROR", colors.BG_RED);
  }

  return level;
}

function getCustomMessage(
  message: string,
  level: string,
  type?: string,
  shouldColorize: boolean = false,
  source?: string
) {
  // Helper to wrap text with foreground + small padding
  const colorText = (text: string, fgColor: string, pad = 1) => {
    const paddedText = "".repeat(pad) + text + " ".repeat(pad);
    return `${fgColor}${paddedText}${colors.RESET}`;
  };

  if (!shouldColorize) return message;

  // Example logic for coloring messages
  if (source === "express-winston") {
    if (level.includes("info")) return colorText(message, colors.FG_CYAN);
    if (level.includes("error")) return colorText(message, colors.FG_MAGENTA);
  }

  if (level.includes("info")) return colorText(message, colors.FG_GREEN);
  if (level.includes("error") && type === "operational")
    return colorText(message, colors.FG_YELLOW);
  if (level.includes("error")) return colorText(message, colors.FG_RED);

  return message;
}

const baseFormat = combine(errors({ stack: true }), timestamp());

const consoleFormat = (shouldColorize = false) => {
  const format: any[] = [];
  const logFormat = printf(
    ({
      timestamp,
      level,
      message,
      stack,
      service,
      pid,
      type,
      comingFrom,
      meta,
      error,
    }) => {
      stack = stack || (error as Error)?.stack || "";
      type = (meta as { type: string })?.type || type;
      let source = (meta as { source: string })?.source;
      const customLevel = getCustomLevel(
        level,
        type as string,
        shouldColorize,
        source
      );
      const blueTimestamp = `\x1b[34m${timestamp}\x1b[0m`;
      const header = `[${
        shouldColorize ? blueTimestamp : timestamp
      }] ${customLevel}`;
      message = getCustomMessage(
        message as string,
        level,
        type as string,
        shouldColorize,
        source
      );
      const bodyText = `[${service}] [PID:${pid}]: ${message}`;
      const fullBody = stack ? `${bodyText}\n${stack}` : bodyText;
      comingFrom = comingFrom
        ? `\n${indent(`COMING FROM : ${comingFrom}`)}`
        : "";
      return `${header}${comingFrom}\n${indent(fullBody)}\n`;
    }
  );

  return combine(...format, logFormat);
};

const jsonFormat = combine(
  json({
    space: 2,
  })
);

function createLoggerInstance(
  serviceName: string,
  generateFile: boolean = false
) {
  const transportList: Array<ConsoleTransportInstance | DailyRotateFile> = [
    new transports.Console({
      format: consoleFormat(true),
    }),
  ];

  if (generateFile) {
    transportList.push(
      new DailyRotateFile({
        filename: "logs/%DATE%/combined-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        format: consoleFormat(), // no colors
      })
    );

    transportList.push(
      new DailyRotateFile({
        filename: "logs/%DATE%/error-%DATE%.log",
        level: "warn",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "30d",
        format: consoleFormat(),
      })
    );
  }

  return createLogger({
    level: "info",
    format: baseFormat,
    transports: transportList,
    defaultMeta: {
      pid: process.pid,
      service: serviceName,
    },
  });
}

export { createLoggerInstance, jsonFormat };
