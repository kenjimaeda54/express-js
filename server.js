const express = require("express");
const app = express();
const route = require("./src/routes/index.routes");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
//views (nome da pasta aonde vai estar os arquivos html)
//src e views sao os caminhos absolutos
app.set("views", path.resolve(__dirname, "src", "views"));
//aqui e o engine e outro oque deseja usar.
//engine e porque html puro nao tem if,for,while,etc
app.set("view engine", "ejs");
app.use(route);

app.listen(3030, () => {
  console.log("Click here http://localhost:3030");
  console.log("Server is running on port 3030");
});
