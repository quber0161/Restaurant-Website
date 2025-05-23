import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true }
});

const categoryModel = mongoose.model.category || mongoose.model("category", categorySchema);

export default categoryModel;