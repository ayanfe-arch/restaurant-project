const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
exports.protect = async (req, res, next) => {
try {
const header = req.headers.authorization;
if (!header || !header.startsWith("Bearer ")) {
return res.status(401).json({
  success: false,
  message: "Authentication required. Please log in first",
});
}
const token = header.split(" ")[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.id);

if (!req.user) {
  return res.status(401).json({
    success: false,
    message: "User no longer exists",
  });
}

next();
} catch (err) {
return res.status(401).json({
  success: false,
  message: "Invalid or expired token. Please log in again",
});
}
};
exports.authorize = (...roles) => (req, res, next) => {
if (!roles.includes(req.user.role)) {
return res.status(403).json({ success: false, message: "You do not have permission" });
}
next();
};


