const app = require("express");
const route = app.Router();
const home = require("../controllers/homeController");
const contact = require("../controllers/contactController");

// GET /
route.get("/", home.initial);
route.post("/", home.create);

// GET / contact
route.get("/contact", contact.home);

module.exports = route;
