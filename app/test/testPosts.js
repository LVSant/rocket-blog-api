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
                console.log('Failed to remove all posts', err);
            } else if (removed) {
                var newPost = new Post({
                    _id: null,
                    title: "post title",
                    img: "base64img",
                    resumeContent: "resumed html content",
                    content: "big html content",
                    category: "news",
                    date: "2018-04-20T16:20:00.000Z",
                    author: "someone"
                });

                Post.create(newPost, function (err, Post) {
                    if (err) {
                        console.error('failed to create post:', err);
                    }
                    if (Post) {
                        done();
                    }
                });
            }
        });
    });

    describe('/GET blog/post', () => {
        it('should return an array with the post', (done) => {
            chai.request(server)
                .get('/blog/post')
                .end((err, res) => {
                    if (err)
                        throw err;


                    res.should.have.status(200);
                    res.body.posts.should.be.a('array');


                    expect(res.body.success).to.be.true;

                    res.body.posts[0].title.should.eql('post title');
                    res.body.posts[0].img.should.eql('base64img');
                    res.body.posts[0].resumeContent.should.eql('resumed html content');
                    res.body.posts[0].content.should.eql('big html content');
                    res.body.posts[0].category.should.eql('news');
                    res.body.posts[0].date.should.eql('2018-04-20T16:20:00.000Z');
                    res.body.posts[0].author.should.eql('someone');

                    done();
                });
        });
    });

    after(function (done) {
        Post.remove({ date: "2018-04-20T16:20:00.000Z" }, function (err, removed) {
            if (err)
                throw err;
            done();
        });
    });
});
