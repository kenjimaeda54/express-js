const app = require("express");
const route = app.Router();
const home = require("../controllers/homeController");
const login = require("../controllers/loginController");
const contacts = require("../controllers/contactController");
const { haveUser } = require("../middleware/index");

// Rotas da Home
route.get("/", home.index);

//rotas Login
route.get("/login", login.index);
route.post("/login/singRegister", login.loginRegister);
route.post("/login/singIn", login.loginIn);
route.get("/login/logout", login.logout);

//rotas de contatos
route.get("/contacts", haveUser, contacts.index);
route.post("/contacts/register", haveUser, contacts.register);
route.get("/contacts/:id", haveUser, contacts.getContactById);
route.post("/contacts/edit/:id", haveUser, contacts.editContact);
route.get("/contacts/delete/:id", haveUser, contacts.deleteContact);

module.exports = route;
