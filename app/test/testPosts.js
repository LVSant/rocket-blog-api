var mongoose = require('mongoose');
var Post = require('../model/blog');
var config = require('../../config');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../server');
var should = chai.should();

chai.use(chaiHttp);




describe('Testing da Blog', function () {

    before(function (done) {
        mongoose.connect(config.database, {
            useMongoClient: true
        });
        var db = mongoose.connection;

        db.collection('Blog').remove({}, function (err, removed) {
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
                        console.log('IN TEST\n RES:', res.body);

                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(0);
                        done();
                    });
        });
    });
});
