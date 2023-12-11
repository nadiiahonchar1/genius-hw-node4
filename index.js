const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
// const { v4: uuidv4 } = require("uuid");

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

const checkExist = (task, res) => {
  if (!task) {
    return res.status(404).json({ message: "Not found" });
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

app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", (err, rows) => {
    serverError(err, res);
    return res.status(200).json(rows);
  });
});

// app.post("/tasks", (req, res) => {
//   const newTask = req.body;
// tasks.push(newTask);
//   db.run("INSERT INTO tasks (text) VALUE (?)", [newTask.text], (err) => {
//     serverError(err, res);
//     return res.status(201).json({ id: this.lastID });
//   });
// });
app.post("/tasks", (req, res) => {
  const newTask = req.body;
  const taskId = Math.floor(Math.random() * 1001);

  if (!newTask || !newTask.text) {
    return res.status(400).json({ message: "Invalid task data" });
  }

  const task = {
    id: taskId,
    text: newTask.text,
  };

  tasks.push(task);

  db.run(
    "INSERT INTO tasks (id, text) VALUES (?, ?)",
    [taskId, newTask.text],
    (err) => {
      serverError(err, res);
      return res.status(201).json(task);
    }
  );
});

app.get("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  // const foundTask = tasks.find((task) => task.id === taskId);

  db.get("SELECT * FROM tasks WHERE id = ?", taskId, (err, row) => {
    serverError(err, res);
    checkExist(row, res);
    return res.status(200).json(row);
  });
});

app.put("/tasks/:id", (req, res) => {
  const { text } = req.body;
  const taskId = parseInt(req.params.id);
  // const foundTask = tasks.find((task) => task.id === taskId);

  // checkExist(foundTask, res);

  db.run("UPDATE tasks SET text = ? WHERE id = ?", [text, taskId], (err) => {
    serverError(err, res);
    return res.status(200).json({ id: taskId, text });
  });

  // foundTask.text = updatedTask.text;
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  // tasks = tasks.filter((task) => task.id !== taskId);
  db.run("DELETE from tasks WHERE id = ?", taskId, (err) => {
    serverError(err, res);
    return res.status(204).send();
  });
});

app.listen(port, () => {
  console.log(`Server runing on http://localhost:${port}`);
});
