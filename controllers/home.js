exports.initial = (req, res) => {
  res.send(`
    <form method="POST" action="/">
      Nome do cliente <input type="text" name="nome" />
      <button>Enviar</button>
    </form>
  `);
};

exports.create = (req, res) => {
  res.send(`O nome do cliente é ${req.body.nome}`);
};
