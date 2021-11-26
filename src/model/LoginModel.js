const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

//mongoose espera o nome da tabela
//e seu squema
const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.erros = [];
    this.users = null;
  }
  async register() {
    this.validate();
    //esta linha estou garantindo que se houver erro
    //a funcao nao vai continuar
    if (this.erros.length > 0) return;
    this.haveUser();
    if (this.erros.length > 0) return;
    try {
      //com salt eu vou fazer um hash da senha
      const salt = await bcryptjs.genSaltSync();
      this.body.password = await bcryptjs.hashSync(this.body.password, salt);
      this.users = await LoginModel.create(this.body);
    } catch (e) {
      console.log(e);
    }
  }

  validate() {
    this.cleanup();
    if (!validator.isEmail(this.body.email)) this.erros.push("Email inválido");

    if (this.body.password.length < 3 || this.body.password.length > 50)
      this.erros.push("Senha precisa ser maior que 3 e menor que 50");
  }

  async haveUser() {
    try {
      //findOne retorna um objeto, se nao encontrar retorna null
      //email precisa ser o campo correto do banco de dados
      const user = await LoginModel.findOne({ email: this.body.email });
      if (user) this.erros.push("Usuário já existe");
    } catch (e) {
      console.log(e);
    }
  }

  cleanup() {
    //estou garantindo uma string vazia;
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }
    //meu objeto real possui tambem o campo csf,entao estou
    //montando um objeto novo;
    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
