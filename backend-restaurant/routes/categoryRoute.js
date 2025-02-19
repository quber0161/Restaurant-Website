import express from "express";
import multer from "multer";
import { addCategory, listCategory, removeCategory } from "../controllers/categoryController.js";



const categoryRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
    destination: "uploads/categories",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

categoryRouter.post("/add", upload.single("image"), addCategory)
categoryRouter.get("/list", listCategory)
categoryRouter.post("/remove", removeCategory);




export default categoryRouter;





























// // ✅ Check if MongoDB is properly connected
// import mongoose from "mongoose";
// if (!mongoose.connection.readyState) {
//     console.error("MongoDB connection is not ready!");
// }

// // const router = express.Router();

// const categoryRouter = express.Router();

// // ✅ Get All Categories (Return Image URL)
// categoryRouter.get("/", async (req, res) => {
//     try {
//         const categories = await categoryModel.find();

//         res.json({
//             success: true,
//             categories: categories.map(cat => ({
//                 _id: cat._id,
//                 name: cat.name,
//                 image: cat.image
//             }))
//         });
//     } catch (err) {
//         console.error("Error fetching categories:", err);
//         res.status(500).json({ success: false, message: "Error fetching categories" });
//     }
// });


// // Image Storage Engine
// const storage = multer.diskStorage({
//     destination: "uploads/categories",
//     filename: (req, file, cb) => {
//         return cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// const upload = multer({ storage: storage });

// categoryRouter.post("/add", upload.single("image"), async (req, res) => {
//     try {
//         const { name } = req.body;
//         if (!name) {
//             return res.status(400).json({ success: false, message: "Category name is required" });
//         }
        
//         const image = req.file ? req.file.filename : "default-category.jpg"; // ✅ Ensure image is set
        
//         // Check if category already exists
//         const categoryExists = await categoryModel.findOne({ name });
//         if (categoryExists) {
//             return res.status(400).json({ success: false, message: "Category already exists" });
//         }

//         // ✅ Save category
//         const newCategory = new categoryModel({ name, image });
//         await newCategory.save();

//         res.json({ success: true, id: newCategory._id, image, message: "Category added successfully" });
//     } catch (err) {
//         console.error("Error adding category:", err);
//         res.status(500).json({ success: false, message: "Error adding category" });
//     }
// });

// // Delete a category
// categoryRouter.delete("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         await categoryModel.findByIdAndDelete(id);
//         res.json({ success: true, message: "Category removed successfully" });
//     } catch (err) {
//         res.json({ success: false, message: err.message });
//     }
// });


// export default categoryRouter;