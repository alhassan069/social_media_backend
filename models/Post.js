const { Schema, model, default: mongoose } = require('mongoose');

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        user: { type: mongoose.Types.ObjectId, ref: 'User' },
        likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
        comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],

    }, {
    timestamps: true
}
)

module.exports = model("Post", postSchema);