const app = require("express");
const route = app.Router();
const home = require("../controllers/home");
const contact = require("../controllers/contact");

// GET /
route.get("/", home.initial);
route.post("/", home.create);

// GET / contact
route.get("/contact", contact.home);

module.exports = route;
