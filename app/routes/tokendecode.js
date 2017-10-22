var jwt = require('jwt-simple');
var config = require('../../config');


module.exports = function tokenDecode() {
    this.decode = function (token) {        
        var decoded = jwt.decode(token, config.jwtSecret);
        console.log(decoded);
    };
}