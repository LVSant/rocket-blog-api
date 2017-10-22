var blogRoutes = require('./blog_routes');
var userRoutes = require('./user_routes');
var jwt = require('jsonwebtoken');
var config = require('../../config');
module.exports = function (app, db) {

    app.post("/token", function (req, res) {
        db.collection('user').find({}).toArray(function (err, allUsers) {

            if (err)
                throw err;

            if (req.body.email && req.body.password) {
                var email = req.body.email;
                var password = req.body.password;
                var user = allUsers.find(function (u) {
                    return u.email === email && u.password === password;
                });
                console.log('user: ', user);
                if (user) {
                    var payload = {
                        id: user.id
                    };

                    var token = jwt.sign(payload, config.jwtSecret, {
                        expiresIn: 60 * 1 //1h
                    });
                    res.json({
                        success: true,
                        token: token});
                } else {
                    res.sendStatus(401);
                }
            } else {
                res.sendStatus(401);
            }
        });
    });

    app.use(function (req, res, next) {
        var token = req.get('Authorization');
        if (token) {
            console.log('tokenDecode', token);
            jwt.verify(token, config.jwtSecret || process.env.JWTSECRET, function (err, decoded) {
                if (err) {
                    return res.status(401).json({success: false, message: 'Failed to authenticate token'});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({success: false, message: 'No token provided.'});
        }
    });

    app.all('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });
    blogRoutes(app, db);
    userRoutes(app, db);
};