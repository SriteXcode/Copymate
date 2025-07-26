import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  userId: String,
  content: String,
  tag: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Note", noteSchema);