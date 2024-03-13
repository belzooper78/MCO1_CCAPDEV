import mongoose from "mongoose";

const connect = mongoose.connect("mongodb://localhost:27017/BNN-accounts");

connect.then(() => {
    console.log("Database connected successfully");
}).catch(() => {
    console.log("Database connection failed");
});

const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const collection = mongoose.model("users", loginSchema);

export default collection;