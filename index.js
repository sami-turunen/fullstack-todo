const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"));

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const Todo = mongoose.model("Todo", todoSchema);

app.get("/todos", async (req, res) => {
  const todos = await Todo.find({});
  res.json(todos);
});

app.get("/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (todo) res.json(todo);
  else res.status(404).end();
});

app.post("/todos", async (req, res) => {
  const { text } = req.body;
  const todo = new Todo({ text: text });
  const savedTodo = await todo.save();
  res.json(savedTodo);
});

app.put("/todos/:id", async (req, res) => {
  const { text } = req.body;
  const todo = {
    text: text,
  };

  const filter = { _id: req.params.id };
  const updatedTodo = await Todo.findOneAndUpdate(filter, todo, { new: true });
  res.json(updatedTodo);
});

app.delete("/todos/:id", async (req, res) => {
  const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
  if (deletedTodo) res.json(deletedTodo);
  else res.status(404).end();
});

app.use(express.static(path.join(__dirname, "sivu")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "sivu", "index.html"));
});

app.listen(port || 3000, () => {
  console.log(`Server running on port ${port}`);
});
