const Contact = require("../model/ContactModel");

exports.index = (req, res) => {
  //na mesma tela vai aparecer vazio ou com os dados do usuario
  //para nao dar undefined em contact criei objeto vazio
  res.render("contact", {
    contact: {},
  });
};

exports.register = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.register();
    if (contact.errors.length > 0) {
      req.flash("erros", contact.errors);
      req.session.save(() => {
        return res.redirect("back");
      });
      return;
    }
    req.flash("success", "Contato cadastrado com sucesso");
    req.session.save(() => {
      return res.redirect(`/contacts/${contact.contact._id}`);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getContactById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.render("404");
    }
    const contact = await Contact.findContactById(req.params.id);
    if (!contact) {
      return res.render("404");
    }
    res.render("contact", { contact });
  } catch (error) {
    console.log(error);
  }
};

exports.editContact = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.render("404");
    }
    const contact = new Contact(req.body);
    await contact.editContact(req.params.id);
    if (contact.errors.length > 0) {
      req.flash("erros", contact.errors);
      req.session.save(() => {
        return res.redirect("back");
      });
      return;
    }
    req.flash("success", "Usuario editado  com sucesso");
    req.session.save(() => {
      return res.redirect("/");
    });
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};

exports.deleteContact = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.render("404");
    }
    const contact = await Contact.deleteContact(req.params.id);
    if (!contact) {
      return res.render("404");
    }
    req.flash("success", "Contato deletado com sucesso");
    req.session.save(() => {
      return res.redirect("back");
    });
  } catch (error) {
    console.log(error);
    res.render("404");
  }
};
