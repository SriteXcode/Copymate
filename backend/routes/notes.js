import express from "express";
import Note from "../models/Note.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/notes", auth, async (req, res) => {
  const note = new Note({ userId: req.userId, ...req.body });
  await note.save();
  res.json({ message: "Saved!" });
});

router.get("/notes", auth, async (req, res) => {
  const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(5);
  res.json({ notes });
});
router.delete("/notes/:id", auth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted!" });
});


export default router;