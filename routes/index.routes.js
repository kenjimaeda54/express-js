const express = require("express");
const routes = express.Router();
const home = require("../controllers/home");

// home
routes.get("/", home.initial);
routes.post("/", home.create);

module.exports = routes;
