var blogProtectedRoutes = require('./protected/blogProtectedRoutes');
var blogOpenRoutes = require('./open/blogOpenRoutes');
var userProtectedRoutes = require('./protected/userProtectedRoutes');
var userOpenRoutes = require('./open/userOpenRoutes');
var utilConf = require('./util');
var util = new utilConf();
var jwt = require('jsonwebtoken');
var config = require('../../config');

module.exports = function (app, db) {

    /*
     * Headers necessary for browser.
     */
    app.all('*', function (req, res, next) {
        if (req.method === 'OPTIONS') {
            console.log('!OPTIONS');
            var headers = {};
            // IE8 does not allow domains to be specified, just the *
            // headers["Access-Control-Allow-Origin"] = req.headers.origin;
            headers["Access-Control-Allow-Origin"] = "*";
            headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
            headers["Access-Control-Allow-Credentials"] = false;
            headers["Access-Control-Max-Age"] = '86400'; // 24 hours
            headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
            res.writeHead(200, headers);
            res.end();
        }
        next();
    });


    /*
     * Generate a token if a valid user is provided;
     */
    app.post('/auth', function (req, res) {
        util.authorization(req, res, db);
    });

    /*
     * Here comes the open routes, that don't need authenticaion
     */
    blogOpenRoutes(app, db);
    userOpenRoutes(app, db);

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