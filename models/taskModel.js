const mongoose = require("mongoose");

const taskShema = new mongoose.Schema({
  text: {
    type: "string",
    require: [true, "Task deskription is required"],
  },
  isComplited: {
    type: "boolean",
    default: false,
  },
});

const Task = mongoose.model("Task", taskShema);
module.exports = {
  Task,
};
