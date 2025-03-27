import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://SHANDIZ:SHANDIZ123@cluster0.1hehu.mongodb.net/SHANDIZ').then(() => console.log("DB Connected"));
}

