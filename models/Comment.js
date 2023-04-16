const { Schema, model, default: mongoose } = require('mongoose');

const commentSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        postedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        postId: {
            type: mongoose.Types.ObjectId,
            ref: "Post",
            required: true,
        }
    }, {
    timestamps: true
}
)

module.exports = model("Comment", commentSchema);