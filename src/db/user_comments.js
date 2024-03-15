import { SchemaTypes, Schema, model } from 'mongoose';
const user_commentSchema = new Schema({
    post: {
        type: SchemaTypes.ObjectId,
        required: true
    },
    content: {
        type: SchemaTypes.String,
        required: true
    },
    upvote:{
        type: SchemaTypes.Number,
        required: true
    },
    downvote:{
        type: SchemaTypes.Number,
        required: true
    },
    isEdited:{
        type: SchemaTypes.Boolean,
        required: true
    },
    isUpvoted:{
        type: SchemaTypes.Boolean,
        required: true
    },
    isDownvoted:{
        type: SchemaTypes.Boolean,
        required: true
    }
});
const user_posts = model('user_comment', user_commentSchema);
export default user_posts;