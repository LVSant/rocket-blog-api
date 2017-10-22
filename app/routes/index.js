var blogProtectedRoutes = require('./protected/blogProtectedRoutes');
var blogOpenRoutes = require('./open/blogOpenRoutes');
var userProtectedRoutes = require('./protected/userProtectedRoutes');
var userOpenRoutes = require('./open/userOpenRoutes');

var jwt = require('jsonwebtoken');
var config = require('../../config');

module.exports = function (app, db) {

    /*
     * Generate a token if a valid user is provided;
     */
    app.post('/auth', function (req, res) {
        
        console.log('post auth');
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
                        expiresIn: 60 * 60 * 2 // 2h
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

    /*
     * Headers necessary for browser.
     */
    app.all('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    /*
     * Here comes the open routes, that don't need authenticaion
     */
    blogOpenRoutes(app, db);
    userOpenRoutes(app, db);

    /*
     * Authenticates the user based on his token.
     * If a invalid token is provided, save it to the next requisitions.
     * All routes above this will require a valid token to work.
     */
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
            return res.status(403).send({success: false, message: 'Token not found.'});
        }
    });

    /*
     * Here comes the routes that need authentication
     */
    blogProtectedRoutes(app, db);
    userProtectedRoutes(app, db);
};