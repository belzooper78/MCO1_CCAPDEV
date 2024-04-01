import { SchemaTypes, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import fs from 'fs';
const user_Schema = new Schema({    
    username: {
        type: SchemaTypes.String,
        required: true,
        trim: true
    },
    password: {
        type: SchemaTypes.String,
        required: true
    },
    imageP: {//profile picture imageP 
        data: { //default image I drew
            type: Buffer, 
            default: fs.readFileSync('public/images/pfp.png') 
        },
        contentType: {
            type: String,
            default: 'image/png' 
        }
    },
    imageB: {//BACKGROUND IMAGE
        data: { //default image I drew
            type: Buffer, 
            default: fs.readFileSync('public/images/pfp.png') 
        },
        contentType: {
            type: String,
            default: 'image/png' 
        }
    }

});

const user_Account = model('user_Account', user_Schema);
export default user_Account;