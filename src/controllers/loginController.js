const Login = require("../model/LoginModel");

exports.index = (req, res, post) => {
  res.render("login");
};

exports.loginRegister = (req, res, post) => {
  const login = new Login(req.body);
  login.register(req.body);
  res.send(req.body);
};
