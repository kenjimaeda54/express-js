exports.globalMiddleware = (req, res, next) => {
  //variavel local para erros
  //variaveis locais sao apenas ideias quando persistem em monte de lugares
  res.locals.erros = req.flash("erros");
  res.locals.success = req.flash("success");
  res.locals.user = req.session.user;
  next();
};

exports.errorCsurf = (err, req, res, next) => {
  //erro abaixo e para erros de token,evitar ataques de força bruta
  // if ("EBADCSRFTOKEN" === err.code) {
  //   return res.render("404");
  // }
  if (err) {
    return res.render("404");
  }
  next();
};

exports.valueToken = (req, res, next) => {
  //variavel local
  res.locals.token = req.csrfToken();
  next();
};

exports.haveUser = (req, res, next) => {
  if (!req.session.user) {
    req.flash("erros", "Você precisa estar logado para acessar essa página");
    req.session.save(() => {
      return res.redirect("/");
    });
    return;
  }
  next();
};
