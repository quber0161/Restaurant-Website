import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import extraModel from "../models/extraModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//placing user order from front end
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        const userId = req.userId;
        if (!userId) {
            return res.json({ success: false, message: "User not authenticated" });
        }

        console.log("🔹 Received order request:", req.body.items);

        if (!req.body.items || req.body.items.length === 0) {
            console.error("❌ Order Error: No items in order request.");
            return res.json({ success: false, message: "No items in order" });
        }

        let totalAmount = 0;
        const orderItems = req.body.items.map(item => {
            const extrasTotal = item.extras
                ? item.extras.reduce((acc, extra) => acc + (extra.price * extra.quantity || 0), 0)
                : 0;

            const itemTotal = ((item.price || 0) + extrasTotal) * (item.quantity || 1);
            totalAmount += itemTotal;

            return {
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                extras: item.extras.map(extra => ({
                    _id: extra._id,
                    name: extra.name,
                    quantity: extra.quantity
                })),
                comment: item.comment || ""
            };
        });

        console.log("✅ Processed Order Items:", orderItems);
        console.log("✅ Calculated Total Amount:", totalAmount);

        if (isNaN(totalAmount) || totalAmount <= 0) {
            console.error("❌ Order Error: Invalid totalAmount", totalAmount);
            return res.json({ success: false, message: "Invalid total amount" });
        }

        const newOrder = new orderModel({
            userId: userId,
            items: orderItems,
            amount: totalAmount,
            address: req.body.address,
            date: req.body.date
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        let line_items = [];
        req.body.items.forEach(item => {
            const extrasTotal = item.extras
                ? item.extras.reduce((acc, extra) => acc + (extra.price * extra.quantity || 0), 0)
                : 0;

            const totalItemPrice = (item.price || 0) + extrasTotal;

            line_items.push({
                price_data: {
                    currency: "usd",
                    product_data: { name: item.name || "Unknown Item" },
                    unit_amount: Math.round(totalItemPrice * 100),
                },
                quantity: item.quantity || 1
            });

            item.extras.forEach(extra => {
                if (extra.price) {
                    line_items.push({
                        price_data: {
                            currency: "usd",
                            product_data: { name: `${item.name} - ${extra.name}` },
                            unit_amount: Math.round(extra.price * 100),
                        },
                        quantity: extra.quantity || 1
                    });
                }
            });
        });

        console.log("✅ Stripe Line Items:", line_items);

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("❌ Error processing order:", error);
        res.json({ success: false, message: "Error processing order" });
    }
};





const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (success == "true") {
            const updatedOrder = await orderModel.findByIdAndUpdate(
                orderId,
                { payment: true },
                { new: true }
            );

            // ✅ Emit new order to admin after successful payment
            const io = req.app.get("io");
            io.emit("newOrder", updatedOrder);

            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


// 🟢 Fetch all orders for the admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ payment: true })
            .populate("items.extras"); // ✅ Populate extras with details

        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("❌ Error fetching orders for admin:", error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};




// 🟢 Fetch user-specific orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ userId: req.userId, payment: true })
            .populate("items.extras"); // ✅ Populate extra ingredient details

        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("❌ Error fetching user orders:", error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};






//api for order status update 
const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders,updateStatus }