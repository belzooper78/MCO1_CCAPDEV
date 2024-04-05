import { SchemaTypes, Schema, model } from 'mongoose';
const tag_Schema = new Schema({
    tagName:{
        type: SchemaTypes.String,
        required: true
    },
    totalUsed: {
        type: SchemaTypes.Number,
        default: 0
    },
    timeCreated: {
        type: SchemaTypes.Date,
        default: Date.now
    },
    description:{
        type: SchemaTypes.String,
        default: "No one has made a description yet..."
    }
});
const post_tag = model('post_tags', tag_Schema);
export default post_tag;