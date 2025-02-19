import express from "express"
import cors from "cors"
import { connect } from "mongoose"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/CartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import categoryRouter from "./routes/categoryRoute.js"

// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

//db connection
connectDB();

// api endpoint
app.use("/api/food", foodRouter)
app.use("/foodimages", express.static('uploads/foods'))
app.use("/api/user", userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/category", categoryRouter)
app.use("/categoryimages", express.static('uploads/categories'))

app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})

// mongodb+srv://dilushan06:<db_password>@cluster0.xbo2f.mongodb.net/?