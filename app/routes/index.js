var blogRoutes = require('./blog_routes');
var userRoutes = require('./user_routes');
var jwt = require('jwt-simple');
var config = require('../../config.js');

module.exports = function (app, db) {
    app.post("/token", function (req, res) {
        // console.log('entrou no token');
        db.collection('user').find({}).toArray(function (err, allUsers) {
            if (err)
                throw error;
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
                    var token = jwt.encode(payload, config.jwtSecret);
                    res.json({token: token});
                } else {
                    res.sendStatus(401);
                }
            } else {
                res.sendStatus(401);
            }
        });
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