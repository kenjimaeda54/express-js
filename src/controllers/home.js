exports.initial = (req, res) => {
  res.render("index");
};

exports.create = (req, res) => {
  res.send(`Nome do cliente e ${req.body.name}`);
};
