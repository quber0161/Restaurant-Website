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

        console.log("🔹 Received order request:", JSON.stringify(req.body.items, null, 2));

        let totalAmount = 0;
        let line_items = [];

        const orderItems = await Promise.all(req.body.items.map(async (item) => {
            let extrasTotal = 0;
            let formattedExtras = [];

            if (Array.isArray(item.extras) && item.extras.length > 0) {
                // 🟢 Fetch full details of extras from the database
                const extraIds = item.extras.map(extra => extra._id);
                const extraDetails = await extraModel.find({ _id: { $in: extraIds } });

                formattedExtras = item.extras.map(extra => {
                    const extraData = extraDetails.find(e => e._id.toString() === extra._id);

                    if (extraData) {
                        const extraPrice = extraData.price ? parseFloat(extraData.price) : 0;
                        const extraQuantity = extra.quantity ? parseInt(extra.quantity) : 1;
                        const extraTotal = extraPrice * extraQuantity;

                        extrasTotal += extraTotal;

                        return {
                            _id: extra._id,
                            name: extraData.name,  // ✅ Get correct name
                            price: extraPrice,  // ✅ Get correct price
                            quantity: extraQuantity
                        };
                    } else {
                        return null; // Ignore invalid extras
                    }
                }).filter(extra => extra !== null);
            }

            // ✅ Calculate total price (item + extras)
            const itemTotal = ((item.price || 0) + extrasTotal) * (item.quantity || 1);
            totalAmount += itemTotal;

            // ✅ Push main item to order
            line_items.push({
                price_data: {
                    currency: "usd",
                    product_data: { name: item.name || "Unknown Item" },
                    unit_amount: Math.round((item.price || 0) * 100)
                },
                quantity: item.quantity || 1
            });

            // ✅ Push each extra as a separate line item in Stripe
            formattedExtras.forEach(extra => {
                line_items.push({
                    price_data: {
                        currency: "usd",
                        product_data: { name: `${item.name} - ${extra.name}` },
                        unit_amount: Math.round(extra.price * 100)
                    },
                    quantity: extra.quantity
                });
            });

            return {
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                extras: formattedExtras,
                comment: item.comment || ""
            };
        }));

        console.log("✅ Processed Order Items:", JSON.stringify(orderItems, null, 2));
        console.log("✅ Calculated Total Amount:", totalAmount);
        console.log("✅ Stripe Line Items:", JSON.stringify(line_items, null, 2));

        if (isNaN(totalAmount) || totalAmount <= 0) {
            console.error("❌ Order Error: Invalid totalAmount", totalAmount);
            return res.json({ success: false, message: "Error processing order - Invalid amount" });
        }

        // 🟢 Create new order in MongoDB
        const newOrder = new orderModel({
            userId: userId,
            items: orderItems,
            amount: totalAmount,
            address: req.body.address,
            date: req.body.date
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // 🟢 Create Stripe checkout session
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