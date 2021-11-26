const Contact = require("../model/ContactModel");

exports.index = (req, res, next) => {
  //na mesma tela vai aparecer vazio ou com os dados do usuario
  //para nao dar undefined em contact criei objeto vazio
  res.render("contact", {
    contact: {},
  });
};

exports.register = async (req, res, next) => {
  try {
    const contact = new Contact(req.body);
    await contact.register(req.body);
    if (contact.erros.length > 0) {
      req.flash("erros", contact.erros);
      req.session.save(() => {
        res.redirect("back");
      });
    }
    req.flash("success", "Contanto cadastrado com sucesso");
    //_id e campo do mongo
    req.session.save(() => {
      res.redirect(`/contacts/${contact.contact._id}`);
    });
  } catch (error) {
    console.log(error);
    res.render("404");
  }
};

exports.getContactById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.render("404");
    }
    const contact = await Contact.getById(req.params.id);
    if (!contact) {
      req.flash("erros", "Nao existe contato");
      req.session.save(() => {
        return res.render("404");
      });
    }
    res.render("contact", { contact });
  } catch (error) {
    console.log(error);
    res.render("404");
  }
};
