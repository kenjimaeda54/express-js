exports.globalMiddleware = (req, res, next) => {
  if (req.body.client) {
    res.send(req.body.client);
  }
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
