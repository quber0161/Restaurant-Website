import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createGuestStripeCheckout, getLastOrder, listOrders, placeOrder, trackGuestOrder, updateStatus, userOrders, verifyOrder } from "../controllers/orderController.js";
import sendEmail from '../utils/sendEmail.js';

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get('/list',listOrders);
orderRouter.post('/status',updateStatus);
orderRouter.post("/guest/checkout", createGuestStripeCheckout)
orderRouter.get("/track/:token", trackGuestOrder)
orderRouter.get("/last/:userId", getLastOrder)

orderRouter.get('/test-email', async (req, res) => {
  try {
    await sendEmail('gunalandilushan@gmail.com', 'Test Email', 'Hello from the restaurant app!');
    res.send('Email sent!');
  } catch (err) {
    res.status(500).send('Email failed');
  }
});

export default orderRouter;