import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (user?.role !== "admin") return res.status(403).json({ error: "Not admin" });

    req.userId = decoded.userId;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};
// This middleware checks if the user is an admin by verifying the JWT token and checking the user's role.
// If the user is not an admin, it returns a 403 Forbidden response. If the user is an admin, it allows the request to proceed.