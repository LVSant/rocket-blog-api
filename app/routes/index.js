var postProtectedRoutes = require('./protected/postProtectedRoutes');
var postOpenRoutes = require('./open/postOpenRoutes');
var userProtectedRoutes = require('./protected/userProtectedRoutes');
var utilConf = require('./util');
var util = new utilConf();
var jwt = require('jsonwebtoken');
var config = require('../../config');
var cors = require('cors');


module.exports = function (app, db) {

    /*
     * Headers necessary for browser.
     */
    app.use(cors());

    app.get('/', function (req, res) {

        res.send('<html>\n\
                    <h2>Rocket Blog API</h2><br><br>\n\
                 </html>');
    });

    /*
     * Generate a token if a valid user is provided;
     */
    app.post('/admin/auth', function (req, res) {
        util.authorization(req, res, db);
    });

    /*
     * Here comes the open routes, that don't need authenticaion
     */
    postOpenRoutes(app, db);

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
    postProtectedRoutes(app, db);
    userProtectedRoutes(app, db);
};