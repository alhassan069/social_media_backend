const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
}
)


// _muskan_2345
// 
module.exports = mongoose.model('User', userSchema)