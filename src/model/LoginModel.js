const mongoose = require("mongoose");
const validator = require("validator");

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
    try {
      this.users = await LoginModel.create(this.body);
    } catch (error) {
      console.log(error);
    }
  }
  validate() {
    this.cleanUp();
    if (!validator.isEmail(this.body.email))
      this.erros.push("Email precisa ser valido");
    if (this.body.password.length < 3 || this.body.password.length > 50)
      this.erros.push(
        "Senha precisa ser maior que 3 e menor que 50 caracteres"
      );
  }
  cleanUp() {
    //estou garantindo uma string vazia;
    for (const i in this.body) {
      if (typeof this.body[i] !== "string") {
        this.body[i] = "";
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
