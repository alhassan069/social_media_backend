const bcrypt = require('bcrypt');
const User = require('../models/User');


const getUser = async (req, res, next) => {
    let userID = req.user.user._id;
    let user = await User.findById(userID);
    if (!user) {
        res.status(404).json({ "message": "User not found" });
    } else {

        let name = user.name;
        let followers = user.followers.length;
        let following = user.following.length;
        res.status(200).json({ name, followers, following, })
    }
}



const followUser = async (req, res, next) => {
    const fromUserId = req.user.user._id;
    const toUserId = req.params.id;

    let fromUser;
    try {
        fromUser = await User.findByIdAndUpdate(fromUserId, {
            $push: { following: toUserId }
        }, { new: true });

    } catch (error) {

        console.log(error);
        return res.status(422).json({ error: error });

    }

    let toUser;
    try {
        toUser = await User.findByIdAndUpdate(toUserId, {
            $push: { followers: fromUserId }
        }, { new: true });

    } catch (error) {

        console.log(error);
        return res.status(422).json({ error: error });

    }
    res.status(200).json({ "message": `followed ${toUser.name}` })
}
const unfollowUser = async (req, res, next) => {
    const fromUserId = req.user.user._id;
    const toUserId = req.params.id;

    let fromUser;
    try {
        fromUser = await User.findByIdAndUpdate(fromUserId, {
            $pull: { following: toUserId }
        }, { new: true });

    } catch (error) {

        console.log(error);
        return res.status(422).json({ error: error });

    }

    let toUser;
    try {
        toUser = await User.findByIdAndUpdate(toUserId, {
            $pull: { followers: fromUserId }
        }, { new: true });

    } catch (error) {

        console.log(error);
        return res.status(422).json({ error: error });

    }
    res.status(200).json({ "message": `unfollowed ${toUser.name}` })
}

module.exports = { getUser, followUser, unfollowUser };