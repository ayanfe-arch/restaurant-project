const mongoose = require("mongoose");
const restaurantSchema = new mongoose.Schema(
{
name: { type: String, required: true, trim: true },
address: { type: String, required: true },
city: { type: String, required: true },
phone: { type: String },
isOpen: { type: Boolean, default: true },
owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
},
{ timestamps: true }
);

restaurantSchema.index(
  { owner: 1, name: 1 },
  { unique: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
