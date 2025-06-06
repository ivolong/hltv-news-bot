import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format((info) => {
      const { timestamp, level, message, ...rest } = info;
      return { timestamp, level, message, ...rest };
    })(),
    format.json({ deterministic: false }),
    format.colorize({ all: true }),
  ),
  transports: [new transports.Console()],
});
