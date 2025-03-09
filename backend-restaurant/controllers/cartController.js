import userModel from "../models/userModel.js";
import extraModel from "../models/extraModel.js";

// 🟢 Add item to cart with extras and their quantities
const addToCart = async (req, res) => {
    const { itemId, extras, comment } = req.body;
    const userId = req.userId;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.cartData || typeof user.cartData !== "object") {
            user.cartData = {};
        }

        // ✅ Fetch extras' prices from the database
        let updatedExtras = [];
        for (let extra of extras) {
            const extraDetails = await extraModel.findById(extra._id); // Fetch from database
            if (extraDetails) {
                updatedExtras.push({
                    _id: extraDetails._id,
                    name: extraDetails.name,
                    price: extraDetails.price, // ✅ Ensure price is stored
                    quantity: extra.quantity
                });
            }
        }

        if (!user.cartData[itemId]) {
            user.cartData[itemId] = { quantity: 1, extras: updatedExtras, comment };
        } else {
            let item = user.cartData[itemId];
            item.quantity += 1;
            item.extras = updatedExtras; // ✅ Store extras with correct price
            item.comment = comment;
            user.cartData[itemId] = item;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { cartData: user.cartData },
            { new: true }
        );

        res.json({ success: true, message: "Item added to cart", cartData: updatedUser.cartData });

    } catch (error) {
        console.error("❌ Error adding to cart:", error);
        res.json({ success: false, message: "Error adding to cart" });
    }
};




/// 🟢 Remove item from cart
const removeFromCart = async (req, res) => {
    const { itemId } = req.body;
    const userId = req.userId;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.cartData[itemId]) {  // Check if item exists in cart
            if (user.cartData[itemId].quantity > 1) {
                user.cartData[itemId].quantity -= 1; // Reduce quantity by 1
            } else {
                delete user.cartData[itemId]; // Remove item completely if quantity is 1
            }
        } else {
            return res.json({ success: false, message: "Item not found in cart" });
        }

        user.markModified('cartData'); // Ensure Mongoose detects the change
        await user.save(); // Save the updated cart to database

        res.json({ success: true, message: "Item removed from cart", cartData: user.cartData });

    } catch (error) {
        console.error("❌ Error removing item:", error);
        res.json({ success: false, message: "Error removing item from cart" });
    }
};


// 🟢 Get user cart

const getCart = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // ✅ Fetch extra details from the database
        for (let itemId in user.cartData) {
            let item = user.cartData[itemId];
            if (item.extras && item.extras.length > 0) {
                for (let i = 0; i < item.extras.length; i++) {
                    const extra = await extraModel.findById(item.extras[i]._id);
                    if (extra) {
                        item.extras[i].price = extra.price; // ✅ Assign correct price
                        item.extras[i].name = extra.name;
                    }
                }
            }
        }

        res.json({ success: true, cartData: user.cartData });

    } catch (error) {
        console.error("Error fetching cart:", error);
        res.json({ success: false, message: "Error fetching cart" });
    }
};



export { addToCart, removeFromCart, getCart };