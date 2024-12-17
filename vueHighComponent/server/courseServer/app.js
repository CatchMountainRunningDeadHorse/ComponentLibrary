const express = require("express");
const bodyParser = require("body-parser");

const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST");
  next();
});

const duration = JSON.parse(
  readFileSync(resolve(__dirname, "data/duration.json"), "utf8")
);
const course = JSON.parse(
  readFileSync(resolve(__dirname, "data/course.json"), "utf8")
);
const teacher = JSON.parse(
  readFileSync(resolve(__dirname, "data/teacher.json"), "utf8")
);

app.get("/initial_data", (req, res) => {
  const schedule = JSON.parse(
    readFileSync(resolve(__dirname, "data/schedule.json"), "utf8")
  );

  res.json({
    code: 0,
    msg: "ok",
    data: {
      duration,
      course,
      teacher,
      schedule,
    },
  });
});

app.post("/update_schedule", (req, res) => {
  const { begin_time, course, teacher, weekday } = req.body.data;
  console.log(begin_time, course, teacher, weekday);

  const schedule = JSON.parse(
    readFileSync(resolve(__dirname, "data/schedule.json"), "utf8")
  );
  const item = schedule.find(
    (item) => item.begin_time == begin_time && item.weekday == weekday
  );

  let type = "";
  let result = null;
  if (item) {
    item.course = course;
    item.teacher = teacher;
    result = item;
    type = "EDIT";
  } else {
    let lastID = schedule[schedule.length - 1]
      ? schedule[schedule.length - 1].id
      : 1;
    const newData = {
      id: ++lastID,
      begin_time,
      course,
      teacher,
      weekday,
    };
    schedule.push(newData);
    result = newData;
    type = "ADD";
  }
  writeFileSync(
    resolve(__dirname, "data/schedule.json"),
    JSON.stringify(schedule)
  );
  res.json({
    code: 0,
    msg: "数据写入成功",
    data: {
      type,
      result,
    },
  });
});

app.post("/remove_schedule", (req, res) => {
  const id = req.body.id;
  const schedule = JSON.parse(
    readFileSync(resolve(__dirname, "data/schedule.json"), "utf8")
  );

  const newSchedule = schedule.filter((item) => item.id != id);
  writeFileSync(
    resolve(__dirname, "data/schedule.json"),
    JSON.stringify(newSchedule)
  );
  res.json({
    code: 0,
    msg: "数据删除成功",
    data: {
      type: "REMOVE",
      id,
    },
  });
});

app.listen(3000, () => {
  console.log("listen 3000 OK");
});
