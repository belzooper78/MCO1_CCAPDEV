import { SchemaTypes, Schema, model } from 'mongoose';
const user_postSchema = new Schema({
    title: {
        type: SchemaTypes.String,
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
    },
    createdBy: {
        type: SchemaTypes.String,
        required: true
    }
    //dateTime, views, number of comments to be added in Phase 3
});
const user_posts = model('user_post', user_postSchema);
export default user_posts;