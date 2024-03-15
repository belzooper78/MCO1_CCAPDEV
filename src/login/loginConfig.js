import mongoose from "mongoose";
import { connectToMongo } from "../db/conn.js";
import fs from 'fs';
//const connect = mongoose.connect("mongodb://localhost:27017/BNN-accounts");

connectToMongo().then(() => {
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
    },
    image: {//buffer for image data
        data: { //default image drew
            type: Buffer, 
            default: fs.readFileSync('public/images/pfp.png') 
        },
        contentType: {
            type: String,
            default: 'image/png' 
        }
    }
});

const collection = mongoose.model("Users", loginSchema);

export default collection;