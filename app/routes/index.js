var blogProtectedRoutes = require('./protected/blogProtectedRoutes');
var blogOpenRoutes = require('./open/blogOpenRoutes');
var userProtectedRoutes = require('./protected/userProtectedRoutes');
var utilConf = require('./util');
var util = new utilConf();
var jwt = require('jsonwebtoken');
var config = require('../../config');
var cors = require('cors');


module.exports = function (app, db) {

    app.use(cors());

    /*
     * Generate a token if a valid user is provided;
     */
    app.post('/admin/auth', function (req, res) {
        util.authorization(req, res, db);
    });

    /*
     * Headers necessary for browser.
     */
    app.all('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');

        next();
    });

    /*
     * Here comes the open routes, that don't need authenticaion
     */
    blogOpenRoutes(app, db);

    /*
     * Authenticates the user based on his token.
     * If a invalid token is provided, save it to the next requisitions.
     * All routes below this will require a valid token to work.
     */
    app.use(function (req, res, next) {
        var token = req.get('Authorization');
        if (token) {
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