const mongoose = require("mongoose");
const validator = require("validator");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: {type: String   , required: true };
});

class Login {
  constructor(body) {
    this.body = body;
    this.erros = []; 
    this.users = null;
  }
  register() {
     validate();
  }
  validate() {
    cleanUp();
    if(validator.isEmail(this.body.email)) return ;
    

  }
  cleanUp() {
    //estou garantindo uma string vazia;
    for(i in  this.body) {
      if(typeof this.body[i] === "string" ){
         this.body[i] =  "";
      }
    }
    //meu objeto real possui tambem o campo csf,entao estou
    //montando um objeto novo;
    this.body={
      email: this.body.email,
      password: this.body.password
    }
  }


}

module.exports {
  Login;
}