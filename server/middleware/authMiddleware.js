import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const protectRoute = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Bearer header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user info to request
    next(); // Move to next middleware/route
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
