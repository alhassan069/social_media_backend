require('dotenv').config();
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

// MongoDB models
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');


// Testcases
let testCases = [
    {
        name: "Test1",
        email: "test1@test.com",
        password: "password1",
        token: "",
        id: "",
        posts: [],
    },
    {
        name: "Test2",
        email: "test2@test.com",
        password: "password2",
        token: "",
        id: "",
    },
    {
        name: "Test3",
        email: "test3@test.com",
        password: "password3",
        token: "",
        id: "",
    },
]

describe('All api testing.', () => {

    //clean up the database before testing
    before((done) => {
        User.deleteMany({}).then(function () {
            console.log("User Data deleted"); // Success
        }).catch(function (error) {
            console.log(error); // Failure
        });
        Post.deleteMany({}).then(function () {
            console.log("Post Data deleted"); // Success
        }).catch(function (error) {
            console.log(error); // Failure
        });
        Comment.deleteMany({}).then(function () {
            console.log("Comment Data deleted"); // Success
        }).catch(function (error) {
            console.log(error); // Failure
        });
        done();
    });
    //clean up the database after testing
    // after((done) => {
    //     User.deleteMany({}, function (err) { });
    //     Post.deleteMany({}, function (err) { });
    //     Comment.deleteMany({}, function (err) { });
    //     done();
    // });


    /*
    - EXTRA API -- USER CREATION.
    - Here we will create three users.
    */
    it('it should CREATE a three new users.', (done) => {
        // 1st user creation
        let user1 = {
            name: testCases[0].name,
            email: testCases[0].email,
            password: testCases[0].password
        }
        chai.request(server)
            .post('/api/signup')
            .send(user1)
            .end((err, res) => {

                // Asserts
                res.status.should.be.equal(201);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                testCases[0].id = res.body.id;

                // 2nd user creation

                let user2 = {
                    name: testCases[1].name,
                    email: testCases[1].email,
                    password: testCases[1].password
                }
                chai.request(server)
                    .post('/api/signup')
                    .send(user2)
                    .end((err, res) => {

                        // Asserts
                        res.status.should.be.equal(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('token');
                        testCases[1].id = res.body.id;

                        // 3rd user creation

                        let user3 = {
                            name: testCases[2].name,
                            email: testCases[2].email,
                            password: testCases[2].password
                        }
                        chai.request(server)
                            .post('/api/signup')
                            .send(user3)
                            .end((err, res) => {

                                // Asserts
                                res.status.should.be.equal(201);
                                res.body.should.be.a('object');
                                res.body.should.have.property('token');
                                testCases[2].id = res.body.id;
                                done();
                            });
                    });

            });
    });

    /*
    - POST /api/authenticate should perform user authentication and return a JWT token.
    - INPUT: Email, Password
    - RETURN: JWT token
    */
    it('it should perform user authentication and return a JWT token.', (done) => {
        let user = {
            email: "test1@test.com",
            password: "password1"
        }
        chai.request(server)
            .post('/api/authenticate')
            .send(user)
            .end((err, res) => {
                // Asserts
                res.status.should.be.equal(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                testCases[0].token = res.body.token;

                let user2 = {
                    email: "test2@test.com",
                    password: "password2"
                }
                chai.request(server)
                    .post('/api/authenticate')
                    .send(user2)
                    .end((err, res) => {
                        // Asserts
                        res.status.should.be.equal(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('token');
                        testCases[1].token = res.body.token;
                        done();
                    });
            });
    });




    /*
    - POST /api/follow/{id} authenticated user would follow user with {id}
    */

    it('it should follow user with {id: userID}', (done) => {
        let userID = testCases[1].id;
        let token = testCases[0].token;
        chai.request(server)
            .post('/api/follow/' + userID)
            .set("authorization", "Bearer " + token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('Object');
                res.body.should.have.property('message');
                done();
            });
    });



    /*
    - POST /api/unfollow/{id} authenticated user would unfollow a user with {id}
    */

    it('it should unfollow user with {id: userID}', (done) => {
        let userID = testCases[1].id;
        let token = testCases[0].token;
        chai.request(server)
            .post('/api/unfollow/' + userID)
            .set("authorization", "Bearer " + token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('Object');
                res.body.should.have.property('message');
                done();
            });
    });


    /*
    - GET /api/user should authenticate the request and return the respective user profile.
    - RETURN: User Name, number of followers & followings.
    */

    it('it should GET the user', (done) => {
        let token = testCases[0].token;
        chai.request(server)
            .get('/api/user')
            .set("authorization", "Bearer " + token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('Object');
                done();
            });
    });


    /*
    - POST api/posts/ would add a new post created by the authenticated user.
    - Input: Title, Description
    - RETURN: Post-ID, Title, Description, Created Time(UTC).
    */
    it('it should create a post by the user 1.', (done) => {

        let post = {
            title: "Test post",
            description: "Test post 1."
        };
        let token = testCases[0].token;

        chai.request(server)
            .post('/api/posts')
            .set("authorization", "Bearer " + token)
            .send(post)
            .end((err, res) => {
                // Asserts
                res.status.should.be.equal(201);
                res.body.should.be.a('object');
                res.body.should.have.property('postId');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('createdAt');
                testCases[0].posts.push(res.body.postId);
                // done();

                let post2 = {
                    title: "Test post 2",
                    description: "Test post 2."
                };

                chai.request(server)
                    .post('/api/posts')
                    .set("authorization", "Bearer " + token)
                    .send(post2)
                    .end((err, res) => {
                        // Asserts
                        res.status.should.be.equal(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('postId');
                        res.body.should.have.property('title');
                        res.body.should.have.property('description');
                        res.body.should.have.property('createdAt');
                        testCases[0].posts.push(res.body.postId);
                        done();
                    });
            });
    });



    /*
    - DELETE api/posts/{id} would delete post with {id} created by the authenticated user.
    */

    it('it should delete a post by the user 1.', (done) => {
        let token = testCases[0].token;
        let postID = testCases[0].posts[1];

        chai.request(server)
            .delete('/api/posts/' + postID)
            .set("authorization", "Bearer " + token)
            .end((err, res) => {
                // Asserts
                res.status.should.be.equal(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql("Deleted the post.");
                done();
            });
    });


    /*
    - POST /api/like/{id} would like the post with {id} by the authenticated user.
    */
    it('it should like a post by the user 1.', (done) => {
        let token = testCases[0].token;
        let postID = testCases[0].posts[0];

        chai.request(server)
            .post('/api/like/' + postID)
            .set("authorization", "Bearer " + token)
            .end((err, res) => {
                // Asserts
                res.status.should.be.equal(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql("Liked the post.");
                done();
            });
    });

    it('it should like a post by the user 2.', (done) => {
        let token = testCases[1].token;
        let postID = testCases[0].posts[0];

        chai.request(server)
            .post('/api/like/' + postID)
            .set("authorization", "Bearer " + token)
            .end((err, res) => {
                // Asserts
                res.status.should.be.equal(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql("Liked the post.");
                done();
            });
    });

    /*
    - POST /api/unlike/{id} would unlike the post with {id} by the authenticated user.
    */

    it('it should unlike a post by the user 2.', (done) => {
        let token = testCases[1].token;
        let postID = testCases[0].posts[0];

        chai.request(server)
            .post('/api/unlike/' + postID)
            .set("authorization", "Bearer " + token)
            .end((err, res) => {
                // Asserts
                res.status.should.be.equal(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql("Uniked the post.");
                done();
            });
    });


    /*
     - POST /api/comment/{id} add comment for post with {id} by the authenticated user.
     - Input: Comment
     - Return: Comment-ID
    */

    it('it should add a comment to the post by the user 2.', (done) => {
        let token = testCases[1].token;
        let postID = testCases[0].posts[0];

        let comment = {
            comment: "1st comment",
        }

        chai.request(server)
            .post('/api/comment/' + postID)
            .set("authorization", "Bearer " + token)
            .send(comment)
            .end((err, res) => {
                // Asserts
                res.status.should.be.equal(201);
                res.body.should.be.a('object');
                res.body.should.have.property('commentID');
                done();
            });
    });

    /*
    - GET api/posts/{id} would return a single post with {id} populated with its number of likes and comments
    */

    it('it should GET the post with id populated with its number of likes and comments', (done) => {
        let token = testCases[1].token;
        let postID = testCases[0].posts[0];

        chai.request(server)
            .get('/api/posts/' + postID)
            .set("authorization", "Bearer " + token)
            .end((err, res) => {
                // Asserts
                res.status.should.be.equal(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('likes');
                res.body.should.have.property('comments');
                res.body.should.have.property('createdAt');
                done();
            });
    });



    /*
      - GET /api/all_posts would return all posts created by authenticated user sorted by post time.
      - RETURN: For each post return the following values
          - id: ID of the post
          - title: Title of the post
          - desc: Description of the post
          - created_at: Date and time when the post was created
          - comments: Array of comments, for the particular post
          - likes: Number of likes for the particular post
      */
    it('it should GET all posts created by authenticated user sorted by post time', (done) => {
        let token = testCases[0].token;

        chai.request(server)
            .get('/api/all_posts')
            .set("authorization", "Bearer " + token)
            .end((err, res) => {
                // Asserts
                res.status.should.be.equal(200);
                res.body.should.be.a('object');
                if (res.body.length > 0) {
                    res.body[0].should.have.property('id');
                    res.body[0].should.have.property('title');
                    res.body[0].should.have.property('desc');
                    res.body[0].should.have.property('created_at');
                    res.body[0].should.have.property('comments');
                    res.body[0].should.have.property('likes');
                }
                done();
            });
    });


});
