const Login = require("../model/LoginModel");

exports.index = (req, res) => {
  res.render("login");
};

exports.loginRegister = async (req, res) => {
  const login = new Login(req.body);
  await login.register(req.body);

  if (login.erros.length > 0) {
    //estou criando mensagens flash
    //primeiro parametro e o valor para acessar essa flash
    //segundo sao os valores que desejo exibir
    req.flash("erros", login.erros);
    //garanto que a session esta salva
    req.session.save(() => {
      return res.redirect("back");
    });
    //esse retorno essencial,porque retorno do res.redirect
    //vai retornar para a primeira funcao,mas  neste casso
    //existe um if, entao preciso sair do o if, nao continue a funcao
    return;
  }
  req.flash("success", "Usuario cadastrado com sucesso");
  //garanto que a session esta salva
  req.session.save(() => {
    return res.redirect("back");
  });
};
