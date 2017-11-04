var mongoose = require('mongoose');
var Post = require('../model/post');
var config = require('../../config');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../server');
var should = chai.should();
var dbSetupConf = require('./dbSetup');
var dbSetup = new dbSetupConf();

chai.use(chaiHttp);

describe('Unit Testing - testPosts', function () {

    before(function (done) {
        mongoose.connect(config.database, {
            useMongoClient: true
        });
        var db = mongoose.connection;

        dbSetup.collectionPost(db);

        //Remove all posts
        db.collection('Post').remove({}, function (err, removed) {
            if (err)
                throw err;
            done();
        });

    });


    describe('/GET blog/post', () => {
        it('should GET all the posts', (done) => {
            chai.request(server)
                    .get('/blog/post')
                    .end((err, res) => {
                        if (err)
                            throw err;

                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(0);
                        done();
                    });
        });
    });
});
