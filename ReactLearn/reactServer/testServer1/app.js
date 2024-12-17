const express = require("express");
const bodyParser = require("body-parser");
const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("有人请求服务器1了");
  next();
});
app.get("/get_students", (req, res) => {
  const todos = JSON.parse(
    readFileSync(resolve(__dirname, "./data.json"), "utf8")
  );
  res.json({
    code: 0,
    msg: "ok",
    data: {
      todos,
    },
  });
});

app.post("/addStudents", (req, res) => {
  const { data } = req.body;
  const todos = JSON.parse(
    readFileSync(resolve(__dirname, "./data.json"), "utf8")
  );
  const maxId = todos.reduce((pre, cur) => {
    return pre >= cur.id ? pre + 1 : cur.id + 1;
  }, 1);
  todos.push({ ...data, id: maxId });

  writeFileSync(resolve(__dirname, "./data.json"), JSON.stringify(todos));
  res.json({
    code: 0,
    msg: "ok",
    data: {
      todos,
    },
  });
});

app.post("/post_update", (req, res) => {
  const { data } = req.body;

  const todos = JSON.parse(
    readFileSync(resolve(__dirname, "./data.json"), "utf8")
  );
  let msg = "error";
  const newTodos = todos.map((item) => {
    if (item.id === data.id) {
      item = data;
      msg = "ok";
    }
    return { ...item };
  });
  writeFileSync(resolve(__dirname, "./data.json"), JSON.stringify(newTodos));
  res.json({
    code: 0,
    msg,
    data: {
      newTodos,
    },
  });
});

app.post("/post_updateAll", (req, res) => {
  const newTodos = req.body.data;
  writeFileSync(resolve(__dirname, "./data.json"), JSON.stringify(newTodos));
  res.json({
    code: 0,
    msg: "ok",
    data: {
      newTodos,
    },
  });
});

app.post("/post_delete", (req, res) => {
  const { data } = req.body;
  const todos = JSON.parse(
    readFileSync(resolve(__dirname, "./data.json"), "utf8")
  );
  const newTodos = todos.filter((item) => {
    return !data.includes(item.id);
  });
  writeFileSync(resolve(__dirname, "./data.json"), JSON.stringify(newTodos));
  res.json({
    code: 0,
    msg: "ok",
    data: {
      newTodos,
    },
  });
});
app.listen(3001, () => {
  console.log("3001端口启动成功了...");
});
