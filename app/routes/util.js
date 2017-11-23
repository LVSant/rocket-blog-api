var config = require('../../config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var User = require('../model/user');


module.exports = function () {
    this.authorization = function (req, res) {

        var email = req.body.email;
        var password = req.body.password;
        if (email) {
            if (password) {
                User.findOne({email: email}, function (err, user) {
                    if (err)
                        res.status(500).send({success: false, message: 'Error'});
                    if (!user)
                        res.status(404).send({success: false, message: 'User not found'});

                    if (bcrypt.compareSync(password, user.password)) {
                        var payload = {
                            id: user._id
                        };
                        var token = jwt.sign(payload, config.jwtSecret, {
                            expiresIn: 60 * 60 * 2//2h
                        });
                        res.json({
                            success: true,
                            token: token});
                    } else {
                        res.status(401).send({success: false, message: 'User not found'});
                    }
                });
            } else {
                res.status(401).send({success: false, message: 'Missing Password'});
            }
        } else {
            res.status(401).send({success: false, message: 'Missing Email'});
        }
    };

    this.decode = function (req, res, cb) {
        try {
            var token = req.get('Authorization');
            if (token) {
                jwt.verify(token, config.jwtSecret, function (err, decoded) {
                    if (err) {
                        return res.json({success: false, message: 'Failed to authenticate token.'});
                    } else {
                        req.decoded = decoded;
                        cb();
                    }
                });
            } else {
                return res.status(403).send({message: 'No token provided.'});
            }
        } catch (err) {
            return res.status(403).send('Error trying to decode token. ' + err);
        }
    };

    this.isProdEnvironment = function () {
        try {
            return process.argv[3] === 'prod';
        } catch (err) {
            return true;
        }
    };

    this.setupEnvironment = function (done = null) {

        User.findOne({'email': 'ab', 'role': 'superadmin'}, function (err, superAdmin) {

            if (err) {
                throw err;
            } else {
                if (superAdmin) {
                    console.log('superAdmin found');
                } else {
                    console.log('superAdmin not found');
                    User.remove({}, function (err, removed) {
                        if (err)
                            throw err;
                        if (removed) {
                            console.log('deleted all users');
                        }
                    });

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
                            console.error('failed to create user:', err);
                        }
                        if (User) {
                            console.log('created SuperAdmin');
                        }
                    });
                }
            }
            if (done)
                done();
        });
    };
};
