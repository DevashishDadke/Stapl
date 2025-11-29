import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const rawToken = req.headers.authorization;

  if (!rawToken) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  
  const token = rawToken.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, "MY_SECRET_KEY");
    req.user = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
