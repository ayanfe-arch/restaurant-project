const mongoose = require("mongoose");
const menuItemSchema = new mongoose.Schema(
{
name: { type: String, required: true, trim: true },
description: { type: String },
price: { type: Number, required: true, min: 0 },
category: { type: String, required: true },
available: { type: Boolean, default: true },
restaurant: {
type: mongoose.Schema.Types.ObjectId,
ref: "Restaurant",
required: true,
},
},
{ timestamps: true }
);
module.exports = mongoose.model("MenuItem", menuItemSchema);





