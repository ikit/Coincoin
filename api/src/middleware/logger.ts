import * as morgan from "morgan";
import { format, createLogger, transports, config, addColors } from "winston";
import { format as formatDate } from "date-fns";

const { combine, printf, timestamp, metadata, colorize } = format;

addColors({
    emerg: "magenta",
    alert: "magenta",
    crit: "magenta",
    error: "red",
    warning: "yellow",
    notice: "cyan",
    info: "white",
    debug: "green"
});
export const logger = createLogger({
    level: "debug",
    levels: config.syslog.levels,
    transports: [
        new transports.Console({
            format: combine(
                colorize({ all: true }),
                timestamp(),
                metadata({ fillExcept: ["message", "level", "timestamp"] }),
                printf(info => {
                    let out = `${formatDate(new Date(info.timestamp), "HH:mm:ss:SSSS")} ${info.level.toUpperCase()}: ${
                        info.message
                    }`;
                    if (Object.keys(info.metadata).length !== 0) {
                        if (info.metadata.stack) {
                            out += `\u001b[31m\n${info.metadata.stack}\u001b[39m`;
                        } else {
                            out += ` - ${JSON.stringify(info.metadata)}`;
                        }
                    }
                    return out;
                })
            )
        }),
        new transports.File({
            level: "info",
            filename: "log",
            format: combine(
                timestamp(),
                metadata({ fillExcept: ["message", "level", "timestamp"] }),
                printf(info => {
                    let out = `${formatDate(new Date(info.timestamp), "yyyy.MM.dd HH:mm:ss:SSSS")} ${info.level.toUpperCase()}: ${
                        info.message
                    }`;
                    if (Object.keys(info.metadata).length !== 0) {
                        if (info.metadata.stack) {
                            out += `\n${info.metadata.stack}`;
                        } else {
                            out += ` - ${JSON.stringify(info.metadata)}`;
                        }
                    }
                    return out;
                })
            )
        })
    ]
});
// if (process.env.NODE_ENV === "production") {
//     logger.add(
//         new DailyRotateFile({
//         filename: `${dir}/error_%DATE%.log`,
//         datePattern: "YYYY-MM-DD",
//         zippedArchive: true,
//         maxSize: "20m",
//         maxFiles: "30d",
//         level: "error"
//         })
//     );
//     logger.add(
//         new DailyRotateFile({
//         filename: `${dir}/combined_%DATE%.log`,
//         datePattern: "YYYY-MM-DD",
//         zippedArchive: true,
//         maxSize: "20m",
//         maxFiles: "30d"
//         })
//     );
// }

export const stream = {
    write: message => {
        logger.info(message);
    }
};

export const errorLogHandler = () => (err, req, res, next) => {
    if (process.env.NODE_ENV !== "production") {
        console.error(err);
    }
    const msg = `${req.ip} - ${req.method} ${req.originalUrl} - ${err.message} - ${err.status || 500}`;
    logger.error(msg);
    next();
};

export const accessLogHandler = () => {
    return morgan(":remote-addr - :method :url - :response-time ms - :status", { stream });
};