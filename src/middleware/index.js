exports.globalMiddleware = (req, res, next) => {
  res.locals.erros = req.flash("erros");
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
