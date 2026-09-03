const service = require("../services/user.service");

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await service.findAll(req.query);
        res.json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await service.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};



exports.createUsers = async (req, res, next) => {
  try {
    const allowedFields = ["name", "email", "password"];
    const newUserData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        newUserData[field] = req.body[field];
      }
    });

    const newUser = await service.create(newUserData);



    return res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A user with that email already exists",
      });
    }

    return next(err);
  }
};




exports.deleteUser = async (req, res, next) => {
    try {
        const user = await service.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        await service.deleteUser(req.params.id);
        res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const allowedFields = ["name", "email"];
        const updates = {};

        if (req.body.role !== undefined) {
            if (req.user.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Only admins can update user roles",
                });
            }

            allowedFields.push("role");
        }

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const updatedUser = await service.updateUser(req.params.id, updates);
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, data: updatedUser });
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const allowedFields = ["name", "email"];
        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const updatedUser = await service.updateProfile(req.user.id, updates);
        res.json({ success: true, data: updatedUser });
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    next(err);
  }
};




