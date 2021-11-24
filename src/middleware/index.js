exports.globalMiddleware = (req, res, next) => {
  req.body.client
    ? console.log(`Possui cliente nome e ${req.body.client}`)
    : console.log(`Não possui cliente`);
  next();
};
