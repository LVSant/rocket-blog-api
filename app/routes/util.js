var config = require('../../config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
//var jwt_decode = require('jwt-decode');

module.exports = function () {
    this.authorization = function (req, res, db) {

        if (req.body.email && req.body.password) {
            db.collection('user').find({email: req.body.email}).toArray(function (err, users) {
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
            res.sendStatus(401);
        }
    };

    this.decode = function (req, res) {
        try {
            var token = req.get('Authorization');
            if (token) {
                jwt.verify(token, config.jwtSecret, function (err, decoded) {
                    if (err) {
                        return res.json({success: false, message: 'Failed to authenticate token'});
                    } else {
                        req.decoded = decoded;
                        console.log(req.decoded);
                        next();
                    }
                });
            } else {
                return res.status(403).send({success: false, message: 'No token provided.'});
            }
        } catch (err) {
            return 401;
        }
    };

    this.getAdminUser = function (req, res) {
        try {

        } catch (err) {
            return 401;
        }
    };
};
