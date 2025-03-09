import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            name: String,
            price: Number,
            quantity: Number,
            extras: [{ type: mongoose.Schema.Types.ObjectId, ref: "extra" }], // ✅ Reference to extra model
            comment: { type: String, default: "" }
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
