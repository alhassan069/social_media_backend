const express = require('express');
const router = express.Router();

const { signup, authenticateUser } = require('../controllers/auth.controller');
const { getUser, followUser, unfollowUser } = require('../controllers/user.controller');
const { getAllPosts, addPost, getPost, deletePost, likePost, unlikePost, addComment } = require('../controllers/post.controller');

const authenticate = require('../middlewares/authenticate');

// AUTH routes
router.post('/signup', signup);
router.post('/authenticate', authenticateUser)

// User routes
router.get('/user', authenticate, getUser);
router.post('/follow/:id', authenticate, followUser);
router.post('/unfollow/:id', authenticate, unfollowUser);

// Post routes
router.get('/all_posts', authenticate, getAllPosts);
router.post('/posts', authenticate, addPost);
router.delete("/posts/:id", authenticate, deletePost);
router.get("/posts/:id", authenticate, getPost);

router.post('/like/:id', authenticate, likePost);
router.post('/unlike/:id', authenticate, unlikePost);

router.post('/comment/:id', authenticate, addComment);


module.exports = router;
