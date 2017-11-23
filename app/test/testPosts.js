var mongoose = require('mongoose');
var Post = require('../model/post');
var config = require('../../config');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../server');
var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);


describe('Unit Testing - testPosts', function () {
    beforeEach(function (done) {
        Post.remove({}, function (err, removed) {
            if (err) {
                console.log('Failed to remove all', err);
            } else if (removed) {
                var newPost = new Post({
                    _id: null,
                    title: "title",
                    img: "img",
                    resumeContent: "resumeContent",
                    content: "content",
                    category: "category",
                    date: "2018-04-20T16:20:00.000Z",
                    author: "author"
                });

                Post.create(newPost, function (err, Post) {

                    if (err) {
                        console.error('failed to create post:', err);
                    }
                    if (Post) {
                        console.log('creating post for test');
                        done();
                    }
                });
            }
        });
    });

    describe('/GET blog/post', () => {
        it('should return an array with the post inserted before', (done) => {
            chai.request(server)
                    .get('/blog/post')
                    .end((err, res) => {
                        if (err)
                            throw err;

                        var compareNewPost = [{
                                title: "title",
                                img: "img",
                                resumeContent: "resumeContent",
                                content: "content",
                                category: "category",
                                date: "2018-04-20T16:20:00.000Z",
                                author: "author"
                            }];


                        res.should.have.status(200);
                        res.body.should.be.a('array');

                        expect(JSON.stringify(res.body)).to.be.eql(JSON.stringify(compareNewPost));
                        done();
                    });
        });
    });

    after(function (done) {
        Post.remove({date: "2018-04-20T16:20:00.000Z"}, function (err, removed) {
            if (err)
                throw err;
            done();
        });
    });
});
