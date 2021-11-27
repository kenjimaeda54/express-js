## MVC em Express

Full MVC simples simulando agendas de contatos, com express, mongo dB e ejs.

## Motovicao
Realizar um curso para aprender anteconhecimento de Node js, repositório abordando conhecimento de full mvc em mongo db, express e ejs.

## Features
MVC vem do Model View Controller

- Model neste mvc foi mongoose.
- Mongose e ODM, e uma modelagem de dados de objetos para Java script.
- Mongo db e banco de dados não relacional, normalmente encontramos os ORM que são para bancos como MYSQL.
- Mongoose vai facilitar a leitura, escrita, edição de nossos dados no banco Mongo Db.

View 

- View neste mvc foi a engine EJS
- Sabemos que html puro não possui controles de fluxos,for...
- EJS deixa seu html dinâmico e com super poderes````
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

-  A sigla C de controller, foi feito em  js
- Utilizei recursos de cookies para registrar sessões.
- Usei o princípio de  middlewares nas variáveis locais que persistiam na aplicação toda.
- Cao de uso interesante dos middlewares , verificar se possui usuário logado, caso não exista, certas rotas não, era permitida.
- Midlewares são funções executadas antes de uma rota, ser executada.
- Abaixo apliquei um middleware  global setando a variável local e variáveis de sessões(flash).
- As sessões flash ao invés dos cookies não  são permanentes, assim que atualizar o navegador se perde, ideial para gerar erros de front end.
- Normalmente usamos os middleware  antes de as  rotas serem executadas, assim podemos interceptar e fazer oque desejamos.
- Também usei o recurso do csurf e uma lib para garantir a segurança no software e não permitir ataque de força bruta em nossos htmls.
- Midleware são muito importantes também para evitar repetições de código, precisava aplicar o csurf em toda o aplicativo então criei um midleware é usei na conexão com o banco, além de ser aplicado em cada rota
- Para garantir que o software só vai ser iniciado quando banco estiver pronto emiti um sinal,  este recurso e do expreess
- Apos o sinal for emitido em    app.emit("appStarted"). O sofwtare vai ser iniciado em  app.on("appStarted", () => {}); 

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

```


- Utilizamos variáveis de ambiente para configurar o banco
- Depois configuramos as sessões para ser usada, no caso do cookie precisamos dizer quanto tempo de vida ele vai possuir
- Por boa práticas usamos o banco para armazenar esse cookie ao invés da memória
- Para acessar  as mensagens flash utilizamos a   função flash("erros", contact.errors). Primeiro parâmetro e o valor para referenciar sua flash o segundo  é  valor.
- Se desejo renderizar o erro da sessão flash em algum lugar específico só usar flash("erros);
- No exemplo abaixo eu seto minhas memórias flash, e as recupero no arquivo de view "mensagens". Todas mensagens de erros e sucesso estão concentrado neste arquivo
- Interessante do ejs que permite composição idêntico ao React, tudo que vai se repetir com frequência eu apliquei composição
- Com include eu consigo fazer composições nos arquivos de view ejs
- No arquivo de controllers na função  exports.loginIn  seto meu cookie  req.session.user = login.user e nos arquivos de midleware salvo em uma variável local
- Usando sessões do banco consumo pouca memoria da máquina do usuário, ele vai possuir cookie só salvo quando estiver logado.

```javascript 

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

```
```ejs
//index e.js 

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














