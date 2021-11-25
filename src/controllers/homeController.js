exports.initial = (req, res) => {
  res.render("index", {
    title: "Injentando cosias na view",
    number: [01, 02, 03, 04, 05, 06, 07, 08, 09, 10],
  });
};

exports.create = (req, res) => {
  res.send(`Nome do cliente e ${req.body.client}`);
};
