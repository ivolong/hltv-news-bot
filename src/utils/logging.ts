const winston = require("winston");

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format((info: any) => {
      const { timestamp, level, message, ...rest } = info;
      return { timestamp, level, message, ...rest };
    })(),
    winston.format.json({ deterministic: false }),
    winston.format.colorize({ all: true }),
  ),
  transports: [new winston.transports.Console()],
});
