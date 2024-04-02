import { SchemaTypes, Schema, model } from 'mongoose';
const user_commentSchema = new Schema({
    username:{
        type: SchemaTypes.String,
        required: true
    },
    post: {
        type: SchemaTypes.ObjectId,
        required: true
    },
    content: {
        type: SchemaTypes.String,
        required: true
    },
    totalVote:{
        type: SchemaTypes.Number,
        required: true
    },
    isEdited:{
        type: SchemaTypes.Boolean,
        required: true
    },
    upvote:{
        type: SchemaTypes.Array,
        default: []
    },
    downvote:{
        type: SchemaTypes.Array,
        default: []
    }
});
const user_posts = model('user_comment', user_commentSchema);
export default user_posts;