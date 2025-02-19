import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://dilushan06:0606@cluster0.xbo2f.mongodb.net/restaurant').then(() => console.log("DB Connected"));
}

