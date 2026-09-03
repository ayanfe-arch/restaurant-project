const mongoose = require("mongoose");
const deliverySchema = new mongoose.Schema(
{
order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, unique: true
},
rider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
status: {
type: String,
enum: ["unassigned", "assigned", "picked_up", "delivered"],
default: "unassigned",
},
},
{ timestamps: true }
);
module.exports = mongoose.model("Delivery", deliverySchema);