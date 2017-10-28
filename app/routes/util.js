var config = require('../../config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var userSchema = require('../model/user');
var mongoose = require('mongoose');

module.exports = function () {
    this.authorization = function (req, res, db) {

        if (req.body.email && req.body.password) {
            db.collection('User').find({email: req.body.email}).toArray(function (err, users) {
                if (err)
                    throw err;

                var email = req.body.email;
                var password = req.body.password;
                var user = users.find(function (u) {
                    return u.email === email && bcrypt.compareSync(password, u.password);
                });
                if (user) {
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
                    res.sendStatus(401);
                }
            });
        } else {
            res.status(401).send({message: 'Invalid User or Password'});
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
            return res.status(403).send(err);
        }
    };

    this.getAdminUser = function (req, res) {
        try {

        } catch (err) {
            return 401;
        }
    };

    this.isDevEnvironment = function () {
        try {
            console.log(process.argv);
            return process.argv[3] === 'dev';
        } catch (err) {
            return true;
        }
    };

    this.setupEnvironment = function (db) {
        db.collection('User').findOne({role: 'superadmin'}, function (err, superAdminExists) {
            if (err) {
                throw err;
            } else {
                if (superAdminExists) {
                    console.log('superAdmin found');
                } else {
                    console.log('superAdmin not found');
                    console.log('deleting');
                    db.dropDatabase();
                    console.log('creating user superadmin');

                    var hash = bcrypt.hashSync(config.userAdminPassword, 10);

                    var user = {
                        "name": "Snoopy",
                        "email": "ab",
                        "password": hash,
                        "role": "superadmin",
                        "date": new Date()
                    };

                    db.collection('User').insert(user);
                }
            }
        });
    };
};
