const Post = require('../models/Post');
const Comment = require('../models/Comment');

const getAllPosts = async (req, res, next) => {
    const userID = req.user.user._id;
    let posts;
    try {
        posts = await Post.find({ user: userID }).populate('comments', 'text').sort({ "createdAt": 1 });

    } catch (error) {
        console.log(error)
    }

    if (!posts) return res.status(404).json({ message: "No posts found." });

    let response = [];
    posts.forEach(x => {
        let tempObj = {};
        tempObj.id = x._id;
        tempObj.title = x.title;
        tempObj.desc = x.description;
        tempObj.created_at = x.createdAt;
        tempObj.likes = x.likes.length;
        tempObj.comments = x.comments;

        response.push(tempObj);
    });

    return res.status(200).json({ ...response });
};
const getPost = async (req, res, next) => {
    const postID = req.params.id;
    let post;

    try {
        post = await Post.findOne({ _id: postID });

    } catch (error) {
        console.log(error)
    }
    if (!post) return res.status(404).json({ message: "No post found." });

    let responsePost = {
        id: post._id,
        title: post.title,
        description: post.description,
        likes: post.likes.length,
        comments: post.comments.length,
        createdAt: post.createdAt,

    };
    return res.status(200).json({ ...responsePost });
};

const addPost = async (req, res, next) => {
    const userID = req.user.user._id;
    const { title, description } = req.body;

    if (!title || !description) return res.status(406).json({ message: "Error! Either title or description missing." })

    let post = new Post({
        title, description, user: userID
    });
    try {
        await post.save();

    } catch (error) {
        console.log(error)
        return res.status(501).json({ message: "Internal Server Error. Failed to create the post." })
    }
    let postId = post._id;
    let createdAt = post.createdAt;
    return res.status(201).json({ postId, title, description, createdAt })

};

const deletePost = async (req, res, next) => {
    const userID = req.user.user._id;
    const postID = req.params.id;
    let post
    try {
        post = await Post.findById(postID);
    } catch (error) {
        console.log(error);
    }
    if (!post) return res.status(404).json({ message: "Post not found!" });

    if (post.user.toString() === userID) {

        try {
            await Post.findByIdAndDelete(postID);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error in deleting" });
        }
        return res.status(200).json({ "message": "Deleted the post." })

    } else {
        return res.status(401).json({ message: "Unauthorized to delete this post." })
    }
}

const likePost = async (req, res, next) => {
    const userID = req.user.user._id;
    const postID = req.params.id;

    let post;
    try {
        post = await Post.findByIdAndUpdate(postID, {
            $push: { likes: userID }
        }, { new: true });
    } catch (error) {
        console.log(error);
        return res.status(501).json({ message: "Failed to like the post." })
    }
    if (!post) {
        return res.status(404).json({ message: "Post not found!" });
    }
    return res.status(200).json({ "message": "Liked the post." });



}
const unlikePost = async (req, res, next) => {
    const userID = req.user.user._id;
    const postID = req.params.id;

    let post;
    try {
        post = await Post.findByIdAndUpdate(postID, {
            $pull: { likes: userID }
        }, { new: true });
    } catch (error) {
        console.log(error);
        return res.status(501).json({ message: "Failed to unlike the post." })
    }
    if (!post) {
        return res.status(404).json({ message: "Post not found!" });
    }
    return res.status(200).json({ "message": "Uniked the post." });

}

const addComment = async (req, res, next) => {
    const userID = req.user.user._id;
    const postID = req.params.id;
    const { comment } = req.body;

    if (!userID || !postID || !comment) return res.status(406).json({ messagge: "failed." });

    let newComment;
    try {
        newComment = await Comment.create({
            text: comment,
            postedBy: userID,
            postId: postID,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "failed", message: error.message });
    }

    let commentID = newComment._id;
    let post;
    try {
        post = await Post.findByIdAndUpdate(postID, {
            $push: { comments: commentID }
        }, { new: true });
    } catch (error) {
        console.log(error);
        return res.status(501).json({ message: "Failed to comment the post." })
    }
    if (!post) {
        return res.status(404).json({ message: "Post not found!" });
    }
    return res.status(201).json({ "commentID": commentID });

}

module.exports = { getAllPosts, addPost, getPost, deletePost, likePost, unlikePost, addComment };