import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            name: String,
            price: Number,
            quantity: Number,
            extras: { type: [String], default: [] }, // 🟢 Store selected extra ingredients
            comment: { type: String, default: "" }   // 🟢 Store special instructions
        }
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Order Processing" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
