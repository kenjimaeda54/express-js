const express = require("express");
const app = express();
const routes = require("./routes/index.routes");

app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(3030, () => {
  console.log("Clicked http://localhost:3030");
  console.log("Server is running on port 3030");
});
