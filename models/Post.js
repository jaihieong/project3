const mongoose = require("mongoose");
// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        // The ObjectIds will refer to the ids in the User model
        ref: "user"
    },
    text: {
        type: String,
        required: true
    },
    //User name, not post name
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "user"
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model("post", PostSchema);

module.exports = Post;