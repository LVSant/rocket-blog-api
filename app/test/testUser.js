var mongoose = require('mongoose');
var User = require('../model/user');
var config = require('../../config');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../server');
var agent = chai.request.agent(server);
var utilConf = require('../routes/util');
var util = new utilConf();
var should = chai.should();
var expect = chai.expect;
var bcrypt = require('bcrypt');

chai.use(chaiHttp);


describe('Unit Testing - testUser', function () {

    var token = '';
    before(function (done) {

        User.remove({}, function (err, removed) {
            if (err) {
                console.log('Failed to remove all', err);
            } else if (removed) {
                console.log('removido todos usuarios');
                var hash = bcrypt.hashSync(config.userAdminPassword, 10);
                var user = new User({
                    _id: null,
                    name: "Snoopy",
                    email: "ab",
                    password: hash,
                    role: "superadmin",
                    date: new Date()
                });

                User.create(user, function (err, User) {
                    if (err) {
                        console.log('failed to create admin', err);
                    }
                    if (User) {
                        chai.request(server)
                                .post('/admin/auth')
                                .send({email: 'ab', password: config.userAdminPassword})
                                .end(function (err, res) {
                                    if (res) {
                                        should.not.exist(err);
                                        token = res.body.token;
                                    }
                                });
                    }
                });

                var newUser = new User({
                    _id: null,
                    name: "João Jozé",
                    email: "joaojoze@jozejoao.com",
                    role: "member",
                    date: "2018-04-20T16:20:00.000Z"
                });

                User.create(newUser, function (err, user) {
                    if (err) {
                        console.error('failed to create user:', err);
                    }
                    if (user) {
                        done();
                        console.log('creating user for test');
                    }
                });
            }
        });
    });

    describe('/GET admin/user', () => {
        it('should return an array with the users inserted before', (done) => {
            chai.request(server)
                    .get('/admin/user')
                    .set('Authorization', token)
                    .end((err, res) => {
                        if (err)
                            throw err;

                        var compareNewUser = [{
                                name: "João José",
                                email: "joaojoze@jozejoao.com",
                                role: "member",
                                date: "2018-04-20T16:20:00.000Z"
                            }];


                        res.should.have.status(200);
                        res.body.users.should.be.a('array');

                        //testing superadmin user
                        res.body.users[0].should.have.property('_id');
                        res.body.users[0].should.have.property('name');
                        res.body.users[0].should.have.property('email');
                        res.body.users[0].should.have.property('role');
                        res.body.users[0].should.have.property('date');

                        res.body.users[0].name.should.equal('Snoopy');
                        res.body.users[0].email.should.equal('ab');
                        res.body.users[0].role.should.equal('superadmin');

                        //testing member user
                        res.body.users[1].should.have.property('_id');
                        res.body.users[1].should.have.property('name');
                        res.body.users[1].should.have.property('email');
                        res.body.users[1].should.have.property('role');
                        res.body.users[1].should.have.property('date');

                        res.body.users[1].name.should.equal('João Jozé');
                        res.body.users[1].email.should.equal('joaojoze@jozejoao.com');
                        res.body.users[1].role.should.equal('member');

                        done();
                    });
        });
    });

    after(function (done) {
        done();
//        User.remove({date: "2018-04-20T16:20:00.000Z"}, function (err, removed) {
//            if (err)
//                throw err;
//            if (removed)
//                console.log('User for test removed');
//            done();
//        });
    });
});
