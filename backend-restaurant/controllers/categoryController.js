import categoryModel from "../models/categoryModel.js";
import fs from 'fs'

// add category
const addCategory = async (req, res) => {
    let image_file = `${req.file.filename}`;

    const category = new categoryModel({
        name: req.body.name,
        image: image_file
    })

    try {
        await category.save();
        res.json({ success: true, message: "Category Added" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}


// all category list 
const listCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.json({ success: true, categories })
    } catch (error) {
        console.log(error);
        res.json({ seccess: false, message: "Error fetching" })
    }
}

// remove food item
const removeCategory = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.body.id);
        fs.unlink(`uploads/categories/${category.image}`, () => { })

        await categoryModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Category Removed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error })
    }
}


export { addCategory, listCategory, removeCategory }