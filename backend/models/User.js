import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" } // can be "admin"
});

export default mongoose.model('User', userSchema);

// This schema defines a User model with fields for name, email, password, and role.
// The email field is unique, meaning no two users can have the same email address.
