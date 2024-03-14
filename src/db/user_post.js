import { SchemaTypes, Schema, model } from 'mongoose';
const user_postSchema = new Schema({
    title: {
        type: SchemaTypes.String,
        required: true
    },
    content: {
        type: SchemaTypes.String,
        required: true
    }
   
});
const user_posts = model('user_post', user_postSchema);
export default user_posts;