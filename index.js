const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

// const { v4: uuidv4 } = require("uuid");
const Task = require("./models/taskModel");

const app = express();
const dbName = "tasks.db";
const port = 8080;
const db = new sqlite3.Database(dbName);

let tasks = [
  {
    id: 1,
    text: "Go to shop",
  },
  {
    id: 2,
    text: "By car",
  },
  {
    id: 3,
    text: "Go for a run",
  },
  {
    id: 4,
    text: "Read a book",
  },
  {
    id: 5,
    text: "Call mom",
  },
];

app.use(bodyParser.json());

const checkExist = (task, res, err) => {
  if (!task) {
    return res.status(404).json({ message: err ?? "Not found" });
  }
};

const serverError = (err, res) => {
  if (err) {
    return res.status(500).json({ error: err.message });
  }
};

app.get("/", (req, res) => {
  return res.send("Hello, Express!");
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    return res.status(200).json(tasks);
  } catch (e) {
    console.error("Task creation error: ", e);
    serverError(e, res);
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const newTask = req.body;
    const task = await Task.create({
      text: newTask.text,
    });
    checkExist(task, res, "Task not created");
    return res.status(201).json(task);
  } catch (e) {
    console.error("Task creation error: ", e);
    serverError(e, res);
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const task = await Task.findById(taskId);
    checkExist(task, res);
    return res.status(200).json(task);
  } catch (e) {
    console.error("Task creation error: ", e);
    serverError(e, res);
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const { text, isCompleted } = req.body;
    const taskId = parseInt(req.params.id);
    const task = await Task.findByIdAndUpdate(
      taskId,
      { text, isCompleted },
      { new: true }
    );
    checkExist(task, res);
    return res.status(200).json(task);
  } catch (e) {
    console.error("Task creation error: ", e);
    serverError(e, res);
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const task = await Task.findByIdAndDelete(taskId);
    checkExist(task, res);

    return res.status(204).send();
  } catch (e) {
    console.error("Task creation error: ", e);
    serverError(e, res);
  }
});

app.listen(port, () => {
  console.log(`Server runing on http://localhost:${port}`);
});
