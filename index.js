"use strict";
require("dotenv").config();

const express = require('express');
const app = express();

const cors = require('cors');
const path = require("path");
const connection = require("./database/connection");
const responses = require("./common/responses");
const processes = require("./common/processes");
const port = process.env.PORT || 3000;

const v1Routes = require("./v1/routes");

const Model = require("./models");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responses());

app.use("/api/v1", v1Routes);

// 404, Not Found
app.use((req, res, next) => res.json({
    statusCode : 404,
    message : "NOT_FOUND"
}));

// Error handling
app.use((error, req, res, next) => {
    console.error(error);
    // return res.error(400, error.message || error);
});

app.listen(port, ()=> {
    console.log(`Environment:`, process.env.NODE_ENV);
    console.log(`Running on:`, process.env.PORT);
    connection.mongodb();
    processes.init();
});
