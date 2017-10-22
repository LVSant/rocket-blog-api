var passport = require("passport");
var passportJWT = require("passport-jwt");
var users = require("./app/model/user.js");
var config = require("./config.js");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
module.exports = function () {
    var strategy = new Strategy(params, function (payload, done) {
        var user = users[payload.id] || null;
        //validar usuarios
        if (user) {
            return done(null, {
                id: user.id
            });
        } else {
            return done(new Error("User not found"), null);
        }
    });
    passport.use(strategy);
    return {
        initialize: function () {
            return passport.initialize();
        }
        , authenticate: function () {
            return passport.authenticate("jwt", config.jwtSession || false);
        }
    };
};