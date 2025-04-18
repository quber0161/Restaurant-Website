import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// 🔹 Function to create JWT token
const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET);
};

// 🟢 Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id, user.role); // 🔹 Include role in token
        res.json({ success: true, token, role: user.role, userId: user._id}); // 🔹 Return role
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// 🟢 Register User
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists with this email address" });
        }

        // Validate email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email address" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash user password
        const salt = await bcrypt.genSalt(6);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Assign role based on email (For testing purposes, you can set an admin email)
        const role = email === "admin@email.com" ? "admin" : "user"; // 🔹 Example condition

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            role: role // 🔹 Assign role
        });

        const user = await newUser.save();
        const token = createToken(user._id, user.role); // 🔹 Include role in token
        res.json({ success: true, token, role: user.role, userId: user._id}); // 🔹 Return role
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { loginUser, registerUser };
