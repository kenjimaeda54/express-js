require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
//para realizar uma conexao perfeita com banco de dados
//vamos emitir um sinal,assim quando o banco de dados estiver pronto
//vamos conectar
mongoose
  .connect(
    process.env.CONECTSTRING,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then(() => {
    app.emit("appStarted");
  });

const route = require("./src/routes/index.routes");
const path = require("path");
const {
  globalMiddleware,
  errorCsurf,
  valueToken,
} = require("./src/middleware/index");
//helmet nao e aconselhavel rodar em localhost
// const helmet = require("helmet");
const csurf = require("csurf");

//helmet é uma pratica de segurança que nos ajuda a proteger nossa aplicação
//em aplicativos com express

// app.use(helmet());

//permite que o express entenda json
app.use(express.json());
//permite que o express poste arquivos
app.use(express.urlencoded({ extended: true }));

//criando nossa sessao; ela e salva no banco de dados mongo
// no maxAge determino quanto tempo ela vai durar
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const sessionOptions = session({
  secret: "343434343 snfodfndson 2131231231 abc",
  store: MongoStore.create({ mongoUrl: process.env.CONECTSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true },
});
app.use(sessionOptions);
app.use(flash());

//------
//pasta estatica aonde fica css,imagens,bundle
app.use(express.static(path.resolve(__dirname, "public")));

//----------
// engine
//views (nome da pasta aonde vai estar os arquivos html)
//src e views sao os caminhos absolutos
app.set("views", path.resolve(__dirname, "src", "views"));
//aqui e o engine e outro oque deseja usar.
//engine e porque html puro nao tem if,for,while,etc
app.set("view engine", "ejs");

//---------------------

//e para que o usuario nao possa fazer ataques de força bruta
//errorCsurf e um middleware que eu criei
app.use(csurf());
//middleware
//middleware sao possiveis interceptar as rotas,app.use normalmente
//sao middleware, express e baseado tudo em middleware
//desta forma todas minhas rotas passam no middleware,
//se eu possuir 15 rotas serao acessadas 15 vezes o middleware
//esse midleware precisa estar abaixo da verificacao app.use(csurf())
app.use(errorCsurf);
app.use(valueToken);
app.use(globalMiddleware);
app.use(route);

app.on("appStarted", () => {
  app.listen(3030, () => {
    console.log("Click here http://localhost:3030");
    console.log("Server is running on port 3030");
  });
});
