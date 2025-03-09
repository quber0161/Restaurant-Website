import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    cartData: { type: mongoose.Schema.Types.Mixed, default: {} }, // Store cart data as an object
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
