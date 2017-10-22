var config = require('../../config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


module.exports = function () {
    this.authorization = function (req, res, db) {
        console.log('req.body.email', req.body.email);
        console.log('req.body.password', req.body.password);

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
                        id: user.id
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
};