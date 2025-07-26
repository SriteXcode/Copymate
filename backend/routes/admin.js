import express from "express";
import User from "../models/User.js";
import Note from "../models/Note.js";
import adminOnly from "../middleware/admin.js";

const router = express.Router();

router.get("/admin/users", adminOnly, async (req, res) => {
  const users = await User.find({}, "-password");
  res.json({ users });
});

router.get("/admin/notes", adminOnly, async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json({ notes });
});

router.delete("/admin/user/:id", adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  await Note.deleteMany({ userId: req.params.id });
  res.json({ message: "User and notes deleted" });
});

router.delete("/admin/note/:id", adminOnly, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted" });
});

export default router;
