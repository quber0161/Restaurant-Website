import extraModel from "../models/extraModel.js";

// 🟢 Add Extra Ingredient
const addExtra = async (req, res) => {
    try {
        const { name, price } = req.body;

        const newExtra = new extraModel({ name, price });
        await newExtra.save();

        res.json({ success: true, message: "Extra ingredient added successfully!" });
    } catch (error) {
        console.error("Error adding extra:", error);
        res.json({ success: false, message: "Error adding extra ingredient" });
    }
};

// 🟢 List All Extras
const listExtras = async (req, res) => {
    try {
        const extras = await extraModel.find();
        res.json({ success: true, extras });
    } catch (error) {
        console.error("Error fetching extras:", error);
        res.json({ success: false, message: "Error fetching extra ingredients" });
    }
};

// 🟢 Remove Extra Ingredient
const removeExtra = async (req, res) => {
    try {
        const { id } = req.body;

        await extraModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Extra ingredient removed successfully!" });
    } catch (error) {
        console.error("Error removing extra:", error);
        res.json({ success: false, message: "Error removing extra ingredient" });
    }
};

export { addExtra, listExtras, removeExtra };
