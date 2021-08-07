import 'reflect-metadata';
require("dotenv").config();
import { useContainer } from "typeorm";
import { createExpressServer } from "routing-controllers";
import { logger, errorLogHandler, accessLogHandler } from "./middleware/logger";
import * as express from "express";
import connectionOptions from '../ormconfig';
import { createConnection } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

useContainer(Container);

console.log(connectionOptions)
createConnection(connectionOptions)
    .then(() => {
        logger.info("ORM connection created");

        // create express app
        const app = createExpressServer({
            routePrefix: "/api",
            controllers: [__dirname + "/controllers/*.ts", __dirname + "/controllers/*.js"],
        });

        app.use(express.json({ limit: "50mb" }));
        app.use(express.urlencoded({ extended: true, limit: "50mb" }));
        app.use(accessLogHandler()); // access logs
        app.use(errorLogHandler()); // error logs

        // start express server
        app.listen(process.env.API_PORT);
        logger.info(`Server has started on port ${process.env.API_PORT}.`);
    })
    .catch(error => {
        console.error(error);
        logger.error(error);
    });