import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import extraModel from "../models/extraModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//placing user order from front end
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        // 🟢 Calculate total price including extras
        let totalAmount = 0;
        const orderItems = req.body.items.map(item => {
            // Calculate extras total
            const extrasTotal = item.extras.reduce((acc, extra) => acc + extra.price, 0);
            const itemTotal = (item.price + extrasTotal) * item.quantity;
            totalAmount += itemTotal;

            return {
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                extras: item.extras,  
                comment: item.comment || ""
            };
        });

        // 🟢 Create new order in MongoDB
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: orderItems,
            amount: totalAmount,
            address: req.body.address,
            date: req.body.date
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // 🟢 Prepare Stripe `line_items`
        let line_items = [];
        req.body.items.forEach(item => {
            const extrasTotal = item.extras.reduce((acc, extra) => acc + extra.price, 0);
            const totalItemPrice = item.price + extrasTotal;

            line_items.push({
                price_data: {
                    currency: "usd",
                    product_data: { name: item.name },
                    unit_amount: totalItemPrice * 100,  // Convert to cents
                },
                quantity: item.quantity
            });

            // 🟢 Add extras as separate line items in Stripe
            item.extras.forEach(extra => {
                line_items.push({
                    price_data: {
                        currency: "usd",
                        product_data: { name: `${item.name} - ${extra.name}` },
                        unit_amount: extra.price * 100, // Convert to cents
                    },
                    quantity: item.quantity
                });
            });
        });

        // 🟢 Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Error processing order:", error);
        res.json({ success: false, message: "Error processing order" });
    }
};




const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try {
        if (success=="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }

}

// 🟢 Fetch all orders for the admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).lean();

        // Populate extras names
        for (const order of orders) {
            for (const item of order.items) {
                item.extras = await extraModel.find({ _id: { $in: item.extras } }, "name");
            }
        }

        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


// 🟢 Fetch user-specific orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId }).lean();

        // Populate extras names
        for (const order of orders) {
            for (const item of order.items) {
                item.extras = await extraModel.find({ _id: { $in: item.extras } }, "name");
            }
        }

        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
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