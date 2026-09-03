const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const signToken = (user) =>
 jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res, next) => {
try {
const { name, email, password, role } = req.body;

const allowedRoles = ["customer", "owner", "rider"];
const userRole = role || "customer";

if (role && !allowedRoles.includes(role)) {
  return res.status(400).json({
    success: false,
    message: "Invalid role. Allowed roles: customer, owner, rider",
  });
}

const userData = { name, email, password, role: userRole };
const user = await User.create(userData);

res.status(201).json({ success: true, token: signToken(user) });
} catch (err) {
next(err);
}
};

exports.login = async (req, res, next) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email }).select("+password");
if (!user || !(await user.comparePassword(password))) {
return res.status(401).json({ success: false, message: "You have not registered" });
}
res.json({ success: true, token: signToken(user) });
} catch (err) {
next(err);
}
};

exports.forgotPassword = async (req, res, next) => {
try {
const crypto = require("crypto");

const user = await User.findOne({ email: req.body.email });

if (!user) {
  return res.status(404).json({ success: false, message: "User not found" });
}

const resetToken = crypto.randomBytes(32).toString("hex");

user.resetPasswordToken = resetToken;
user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

await user.save({ validateBeforeSave: false });

res.json({
  success: true,
  message: "If an account with that email exists, a reset link has been sent",
});
} catch (err) {
next(err);
}
};

exports.resetPassword = async (req, res, next) => {
try {
const user = await User.findOne({
  resetPasswordToken: req.params.token,
  resetPasswordExpires: { $gt: Date.now() },
});

if (!user) {
  return res.status(400).json({
    success: false,
    message: "Invalid or expired token",
  });
}

user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;

await user.save();

res.json({
  success: true,
  message: "Password reset successful",
});
} catch (err) {
next(err);
}
};

exports.logoutUser = async (req, res, next) => {
try {
res.clearCookie("token");
res.json({ success: true, message: "Logged out successfully" });
} catch (err) {
next(err);
}
};




