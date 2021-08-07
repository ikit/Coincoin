"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var typeorm_1 = require("typeorm");
var routing_controllers_1 = require("routing-controllers");
var logger_1 = require("./middleware/logger");
var express = require("express");
var ormconfig = require("../ormconfig");
typeorm_1.createConnections(ormconfig)
    .then(function () {
    logger_1.logger.info("ORM connection created");
    // create express app
    var app = routing_controllers_1.createExpressServer({
        routePrefix: "/api",
        controllers: [__dirname + "/controllers/*.ts", __dirname + "/controllers/*.js"],
    });
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(logger_1.accessLogHandler()); // access logs
    app.use(logger_1.errorLogHandler()); // error logs
    // start express server
    app.listen(process.env.API_PORT);
    logger_1.logger.info("Server has started on port " + process.env.API_PORT + ".");
})
    .catch(function (error) {
    console.error(error);
    logger_1.logger.error(error);
});
