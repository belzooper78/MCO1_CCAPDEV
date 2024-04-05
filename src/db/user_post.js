import { SchemaTypes, Schema, model } from 'mongoose';
const user_postSchema = new Schema({
    createdBy: {
        type: SchemaTypes.ObjectId,
        ref:'user_Account',
        required: true
    },
    createdOn: {
        type: SchemaTypes.String,
        required: true
    },
    username:{
        type: SchemaTypes.String,
        required: true
    },
    title: {
        type: SchemaTypes.String,
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
    totalComments:{
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
    },
    dateTime:{
        type: SchemaTypes.Date,
        default: Date.now
    },
    tags:{
        type: SchemaTypes.Array,
        default: []
    }
    //dateTime, views, number of comments to be added in Phase 3
});
const user_posts = model('user_post', user_postSchema);
export default user_posts;