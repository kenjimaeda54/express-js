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
      //estou voltando no ultimo historico chamado
      return res.redirect("back");
    });
    //esse retorno essencial,porque retorno do res.redirect
    //vai retornar para a primeira funcao,mas no caso posue duas
    //fucnoes,entao eu retorno para a segunda funcao
    return;
  }
  res.send(login.erros);
};
