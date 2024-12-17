const express = require("express");
const bodyParser = require("body-parser");
const compile = require("./compile");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"),
    res.header("Access-Control-Allow-Methods", "GET,POST"),
    res.header("Content-type", "application/json;charset=utf-8"),
    res.header(
      "Access-Control-Allow-Headers",
      "Origin,X-Request-With,Content-type,Accept"
    );
  next();
});

app.post("/compile", (req, res) => {
  const { filename, fileJSON } = req.body;
  try {
    compile(filename, fileJSON);
  } catch (error) {
    res.json({
      code: 1,
      msg: error,
    });
  }

  res.json({
    code: 0,
    msg: "ok",
  });
});

app.listen(5050, () => {
  console.log("3000端口启动成功了");
});
