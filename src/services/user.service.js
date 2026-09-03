const User = require("../models/user.model")

const findAll = async (query) => {
const limit = Number(query.limit) || 0;
  return User.find().limit(limit);
};

const findById = async (id) => {
return User.findById(id);
};

const create = async (body) => {
    const newUser = new User(body);
    await newUser.save();
    newUser.password = undefined;
    return newUser;
   }

   const deleteUser = async (id) => {
    return User.findByIdAndDelete(id);
   }

   const updateUser = async (id, body) => {
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (updatedUser) {
        updatedUser.password = undefined;
    };

    return updatedUser;
   }

const updateProfile = async (id, body) => {
    const updatedProfile = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (updatedProfile) {
        updatedProfile.password = undefined;
    }

    return updatedProfile;
};

module.exports = { findAll, findById, create, deleteUser, updateUser, updateProfile };

