const Login = require("../model/LoginModel");

exports.index = (req, res) => {
  //redirecionando para paginas que lindam com sessoes e bom sempre ser
  //a partir do index
  if (req.session.user) return res.render("log_in");
  return res.render("login");
};

exports.loginRegister = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.render("404");
  }
};

exports.loginIn = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.singIn(req.body);

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
    req.flash("success", "Voce entrou no sistema");
    //garanto que a session esta salva
    req.session.user = login.user;
    req.session.save(() => {
      return res.redirect("back");
    });
  } catch (error) {
    console.log(error);
    res.render("404");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
