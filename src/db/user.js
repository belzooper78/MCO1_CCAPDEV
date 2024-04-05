import { SchemaTypes, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const user_Schema = new Schema({    
    username: {
        type: SchemaTypes.String,
        required: true,
        trim: true
    },
    password: {
        type: SchemaTypes.String,
        required: true
    }

});

const user_Account = model('user_Account', user_Schema);
export default user_Account;