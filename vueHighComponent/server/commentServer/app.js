const express = require("express");
const bodyParser = require("body-parser");
const { readFileSync, writeFileSync } = require("fs");
const { resolve, dirname } = require("path");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/get_comments", (req, res) => {
  const comments = JSON.parse(
    readFileSync(resolve(__dirname, "./data.json"), "utf8")
  );
  res.json({
    code: 0,
    msg: "ok",
    data: {
      comments,
    },
  });
});

app.post("/post_comments", (req, res) => {
  const data = req.body.data;
  const comments = JSON.parse(
    readFileSync(resolve(__dirname, "./data.json"), "utf8")
  );
  data.id = comments.length + 1;
  comments.push(data);
  writeFileSync(resolve(__dirname, "./data.json"), JSON.stringify(comments));
  res.json({
    code: 0,
    msg: "ok",
    data: {
      comments,
    },
  });
});
app.listen(8081, () => {
  console.log("8081端口启动成功了...");
});
