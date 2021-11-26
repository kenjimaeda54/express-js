const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  secondName: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  phone: { type: String, required: false, default: "" },
  createdDate: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model("Contacts", contactSchema);

function Contact(body) {
  this.body = body;
  this.erros = [];
  this.contact = null;
}

//funcao estatica nao precisa ser instanciada
Contact.getById = async function (id) {
  if (typeof id !== "string") return;
  const user = await ContactModel.findById(id);
  return user;
};

Contact.prototype.register = async function () {
  this.validate();
  if (this.erros.length > 0) return;
  try {
    this.contact = await ContactModel.create(this.body);
  } catch (err) {
    console.log(err);
  }
};

Contact.prototype.validate = function () {
  this.cleanup();
  if (this.body.email && !validator.isEmail(this.body.email))
    this.erros.push("Email inválido");
  if (!this.body.name) this.erros.push("Contato precisa de nome");
  if (!this.body.email && !this.body.phone)
    this.erros.push("Contato precisa de email ou telefone");
};

Contact.prototype.cleanup = function () {
  //estou garantindo uma string vazia;
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }
  //meu objeto real possui tambem o campo csf,entao estou
  //montando um objeto novo;
  this.body = {
    name: this.body.name,
    secondName: this.body.secondName,
    email: this.body.email,
    phone: this.body.phone,
  };
};

module.exports = Contact;
