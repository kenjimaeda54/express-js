const validator = require("validator");
const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  secondName: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  phone: { type: String, required: false, default: "" },
  createdDate: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model("contacts", ContactSchema);

function Contact(body) {
  this.body = body;
  this.errors = [];
  this.contact = null;
}

Contact.prototype.register = async function () {
  try {
    this.validate();
    if (this.errors.length > 0) return;
    this.contact = await ContactModel.create(this.body);
  } catch (error) {
    console.log(error);
  }
};

Contact.prototype.validate = function () {
  this.cleanUp();
  if (this.body.email && !validator.isEmail(this.body.email))
    this.errors.push("Email invalido");
  if (!this.body.name) this.errors.push("Nome e obrigatorio");
  if (!this.body.email && !this.body.phone)
    return this.errors.push("Nao pode existir contato sem email ou telefone");
};

//precisa ser uma funcao aloca com prototype porque vamos precisar
//dos outros metodos do objeto;
Contact.prototype.editContact = async function (id) {
  try {
    if (typeof id !== "string") return;
    this.validate();
    if (this.errors.length > 0) return;
    this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {
      new: true,
    });
  } catch (e) {
    console.log(e);
  }
};

Contact.prototype.cleanUp = function () {
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
    phone: this.body.phone,
    secondName: this.body.secondName,
    email: this.body.email,
  };
};

//membro estatico nao tem acesso ao this
//funcao estatica nao precisa ser instanciada
Contact.findContactById = async function (id) {
  try {
    if (typeof id !== "string") return;
    const contacts = await ContactModel.findById(id);
    return contacts;
  } catch (error) {
    console.log(error);
  }
};

Contact.getAllContacts = async function () {
  try {
    // -1 sera o ultimo da lista em primeiro
    const contacts = await ContactModel.find().sort({ createdDate: 1 });
    return contacts;
  } catch (error) {
    console.log(error);
  }
};

Contact.deleteContact = async function (id) {
  try {
    const contacts = await ContactModel.findByIdAndDelete({ _id: id });
    return contacts;
  } catch (error) {
    console.log(error);
  }
};

module.exports = Contact;
