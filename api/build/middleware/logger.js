"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessLogHandler = exports.errorLogHandler = exports.stream = exports.logger = void 0;
var morgan = require("morgan");
var winston_1 = require("winston");
var date_fns_1 = require("date-fns");
var combine = winston_1.format.combine, printf = winston_1.format.printf, timestamp = winston_1.format.timestamp, metadata = winston_1.format.metadata, colorize = winston_1.format.colorize;
winston_1.addColors({
    emerg: "magenta",
    alert: "magenta",
    crit: "magenta",
    error: "red",
    warning: "yellow",
    notice: "cyan",
    info: "white",
    debug: "green"
});
exports.logger = winston_1.createLogger({
    level: "debug",
    levels: winston_1.config.syslog.levels,
    transports: [
        new winston_1.transports.Console({
            format: combine(colorize({ all: true }), timestamp(), metadata({ fillExcept: ["message", "level", "timestamp"] }), printf(function (info) {
                var out = date_fns_1.format(info.timestamp, "HH:mm:ss:SSSS") + " " + info.level.toUpperCase() + ": " + info.message;
                if (Object.keys(info.metadata).length !== 0) {
                    if (info.metadata.stack) {
                        out += "\u001B[31m\n" + info.metadata.stack + "\u001B[39m";
                    }
                    else {
                        out += " - " + JSON.stringify(info.metadata);
                    }
                }
                return out;
            }))
        }),
        new winston_1.transports.File({
            level: "info",
            filename: "log",
            format: combine(timestamp(), metadata({ fillExcept: ["message", "level", "timestamp"] }), printf(function (info) {
                var out = date_fns_1.format(info.timestamp, "YYYY.MM.DD HH:mm:ss:SSSS") + " " + info.level.toUpperCase() + ": " + info.message;
                if (Object.keys(info.metadata).length !== 0) {
                    if (info.metadata.stack) {
                        out += "\n" + info.metadata.stack;
                    }
                    else {
                        out += " - " + JSON.stringify(info.metadata);
                    }
                }
                return out;
            }))
        }),
        new PgLogger({
            level: "info",
            format: combine(timestamp(), metadata({ fillExcept: ["message", "level", "timestamp"] }))
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
exports.stream = {
    write: function (message) {
        exports.logger.info(message);
    }
};
var errorLogHandler = function () { return function (err, req, res, next) {
    if (process.env.NODE_ENV !== "production") {
        console.error(err);
    }
    var msg = req.ip + " - " + req.method + " " + req.originalUrl + " - " + err.message + " - " + (err.status || 500);
    exports.logger.error(msg);
    next();
}; };
exports.errorLogHandler = errorLogHandler;
var accessLogHandler = function () {
    return morgan(":remote-addr - :method :url - :response-time ms - :status", { stream: exports.stream });
};
exports.accessLogHandler = accessLogHandler;
