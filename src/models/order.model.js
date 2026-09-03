const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
{
customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
items: [
{
menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
quantity: { type: Number, required: true, min: 1 },
price: { type: Number, required: true },
},
],
total: { type: Number, required: true },
status: {
type: String,
enum: ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered",
"cancelled"],
default: "pending",
},
},
{ timestamps: true }
);
module.exports = mongoose.model("Order", orderSchema);