## MVC em Express

Full MVC simples simuando agendas de contatos,com express,mongo db e ejs

## Motovicao
Realizar um curso para aprender conhecinemnto de Node js,repositorio aboradndno conhencimnto de full mvc em mongo db,express e ejs

## Features
MVC vem do Model View Controller

- Model neste mvc foi mongoose.
- Mongose e ODM, e uma modelagem de dados de objetos para Java script. 
- Mongo db e banco de dados nao relacional,normalmente encontramos os ORM que sao para bancos como MYSQL
- Mongoose vai falicitar a leitura,escrita,edicao de nossos dados no banco Mongo Db

View 

- View neste mvc foi a engine EJS
- Sabemos que html puro nao possui controles de fluxos,for...
- EJS deixa seu html dinamico e com super poderes````
- Abaixo seus principais tags 

``` text

<% Controle de fluxo  %>
<%= Imprime escapando caracter,vai pegar exatamente oque voce escreveu   %>
<%- Imprime sem escapar caracter se colocar html vai exibir %>
<%# Cometario %>
<%- include('Caminho do arquivo') ; %>
<% if(alguma coisa)  { /%>
    
    <%= vou imprimir sem escapar %>

<% } else { %>


<% } %>


```

- Controller ficou por conta da logica js
- Utilizei recursos de cokies para registrar sessoes
- Apliquei midlewares nas variaveis locias que persistiam nas aplciacoes toda.
- Exemplo de midlewares interesante e verificar se possui usuario logado,caso nao exista certas rotas nao era permetida
- Midlewares sao funcoes que sao executadas antes de uma rota,logica com banco... ser exectuada
- Abaixo apliquie um midleware glboal setando a variavel local e variaves de sessoes flash
- As sesseoes flash ao inves dos cokkies sao limitadas,ideias para gerar erros de front end,exemplo caixa de texto que preenchido
- Normalmente usamos os midlewares antes das rotas ser aplciadas,assim podemos interceptar e fazer oque desejamos antes de uma rota ser executada
- Tabmem usei o recurso do csurf e uma lib para garantir a seguranca no aplicativo e nao permtir ataque de forca bruta em nossos htmls.
- Midleware sao muito importatnes tambem para evitar repeticcoes de codigo,precisava aplicar o csurf em toda o sofwtare entao criei um midleware e ussei na conexao com o bancoe e tambem antes das rotas ser executadas
- Para garantir que o sofwtare so vai ser iniciado abos o banco estiver pronto emiti um sinal,recurso do expreesss
- Apos o sinal for emimti em    app.emit("appStarted"). O sofwtare vai ser iniicaod em  app.on("appStarted", () => {}); 

```javascript 

//arquivo midlleware
exports.globalMiddleware = (req, res, next) => {
  //variavel local para erros
  //variaveis locais sao apenas ideias quando persistem em monte de lugares
  res.locals.erros = req.flash("erros");
  res.locals.success = req.flash("success");
  res.locals.user = req.session.user;
  next();
};

exports.errorCsurf = (err, req, res, next) => {
  //erro abaixo e para erros de token,evitar ataques de força bruta
  // if ("EBADCSRFTOKEN" === err.code) {
  //   return res.render("404");
  // }
  if (err) {
    return res.render("404");
  }
  next();
};

//-----------------------------------------------------//


//arquivo serve js

const mongoose = require("mongoose");

mongoose
  .connect(
    process.env.CONECTSTRING,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then(() => {
    app.emit("appStarted");
  });




app.use(csurf());

//se eu possuir 15 rotas serao acessadas 15 vezes o middleware
app.use(errorCsurf);
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

//----------------------------------------------//

// arquivo View

//com auxilio do csrf garnto usando este input o nao ataque de forca burta
        <input type="hidden" name="_csrf" value="<%= token  %>" />

``


- Utilizamos variaveis de hambiente para configurar o banco
- Depois configuramos as sessoes para ser usada,no caso do cokie precisamos dizer quanto tempo de vida ele vai possuir
- Por boa praticas usamos o banco para armazenar esse cokie ao inves na memoria
- As sessoes flahs para ser acessadas utilizamos a funcao flash("erros", contact.errors). Primeiro parametro e um valor de acesso da sua flash o segundo e valor proprimente dito da sua sessao
- Exemplo se desejo renderizar o erro da sessao flahs em algum lugar especifico so usar flas("erros);
- No examplo abaixo eu seto minhas memorias flash, e as recuperos no arquivos de view mensagens. Todas mensanges de erros estao concentrado neste arquivo
- Intesante do ejs que permite composicao identico ao React,tudo que vai se repetir com freqeuencia eu apliquei composicao
- Com include eu consigo fazer composicoes nos arquivos de view ejs
- No arquivo de controllers na funcao  exports.loginIn  seto meu cokei  req.session.user = login.user e nos arquivos de midleware salvo em uma variavel local
- Usando sessoes do banco consumo pouca memoria da maquina do usuario,ele vai possuir cokie so salvo quando estiver logado.

```javascrpit
require("dotenv").config();


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

//------------------------//

//arquivo de controllers

//criando minhas mensagens flash
exports.loginRegister = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.register(req.body);

    if (login.erros.length > 0) {
      //estou criando mensagens flash
      //primeiro parametro e o valor para acessar essa flash
      //segundo sao os valores que desejo exibir
      req.flash("erros", login.erros);
      //garanto que a session esta salva
      req.session.save(() => {
        return res.redirect("back");
      });
      //esse retorno essencial,porque retorno do res.redirect
      //vai retornar para a primeira funcao,mas  neste casso
      //existe um if, entao preciso sair do o if, nao continue a funcao
      return;
    }
    req.flash("success", "Usuario cadastrado com sucesso");
    //garanto que a session esta salva
    req.session.save(() => {
      return res.redirect("back");
    });
  } catch (error) {
    console.log(error);
    res.render("404");
  }
};

exports.loginIn = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.singIn(req.body);

    if (login.erros.length > 0) {
      //estou criando mensagens flash
      //primeiro parametro e o valor para acessar essa flash
      //segundo sao os valores que desejo exibir
      req.flash("erros", login.erros);
      //garanto que a session esta salva
      req.session.save(() => {
        return res.redirect("back");
      });
      //esse retorno essencial,porque retorno do res.redirect
      //vai retornar para a primeira funcao,mas  neste casso
      //existe um if, entao preciso sair do o if, nao continue a funcao
      return;
    }
    req.flash("success", "Voce entrou no sistema");
    //garanto que a session esta salva
    req.session.user = login.user;
    req.session.save(() => {
      return res.redirect("back");
    });
  } catch (error) {
    console.log(error);
    res.render("404");
  }
};

 


//arquivo de midlewares

exports.globalMiddleware = (req, res, next) => {
  //variavel local para erros
  //variaveis locais sao apenas ideias quando persistem em monte de lugares
  res.locals.erros = req.flash("erros");
  res.locals.success = req.flash("success");
  res.locals.user = req.session.user;
  next();
};


//arquivo de view

<% if(erros.length > 0){ %>
<div class="row">
  <div class="col">
    <div class="alert alert-danger">
     <%  erros.forEach(it => { %>
        <small>   <%= it %>   </small>  </br>       
    <% })  %>
    </div>
  </div>
</div>
<%  } %>


//index .js 

<%- include("../includes/head") %> <%- include("../includes/nav") %>

<div class="conatiner">
  <div class="row">
    <div class="col-lg-2"></div>
    <div class="col-lg-8 my-3">
      <h1 class="text-center">Agenda</h1>
      <p class="text-center lead">Seus contatos estao abaixo</p>
      <%- include("../includes/mensagens"); %> <% if(contacts.length > 0 ){ %>
      <div class="responsive-table">
        <table class="table my-3">
          <% contacts.forEach(contact =>{ %>
          <tr>
            <td><%= contact.name %></td>
            <td><%= contact.secondName %></td>
            <td><%= contact.email %></td>
            <td><%= contact.phone %></td>
            <td>
              <a href="/contacts/<%= contact._id %>">Editar</a>
            </td>
            <td>
              <a class="text-danger" href="/contacts/delete/<%= contact._id  %>"
                >Excluir</a
              >
            </td>
            <% }) %>
          </tr>
        </table>
        <% }else { %>
        <strong>Nao possui contatos na sua agenda</strong>
        <% } %>
      </div>
      <div class="col-lg-2"></div>
    </div>
  </div>
  <%- include("../includes/footer") %>
</div>







```














