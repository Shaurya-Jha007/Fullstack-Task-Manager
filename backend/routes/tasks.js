import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { description, completed } = req.body;
    const newTask = await pool.query(
      "INSERT INTO tasks (description, completed) VALUES ($1, $2) RETURNING *",
      [description, completed || false],
    );
    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

router.get("/", async (req, res) => {
  try {
    const allTasks = await pool.query("SELECT * FROM tasks");
    res.json(allTasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed } = req.body;
    const updateTask = await pool.query(
      "UPDATE tasks SET description = $1, completed = $2 WHERE task_id = $3 RETURNING *",
      [description, completed, id],
    );
    if (updateTask.rows.length === 0) {
      return res.status(404).json({ msg: "Task not found!" });
    }
    res.json(updateTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Failed to update! Try again later.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE task_id = $1", [id]);
    res.json("Task was deleted successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Failed deleting task! Try again later.");
  }
});

export default router;
