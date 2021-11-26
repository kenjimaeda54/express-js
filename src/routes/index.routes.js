const app = require("express");
const route = app.Router();
const home = require("../controllers/homeController");
const login = require("../controllers/loginController");

// GET /
route.get("/", home.index);

route.get("/login", login.index);
route.post("/login/singRegister", login.loginRegister);
route.post("/login/singIn", login.loginIn);
route.get("/login/logout", login.logout);

module.exports = route;
