var ObjectID = require('mongodb').ObjectID;
//var mongoose = require('mongoose');
//var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var utilConf = require('../routes/util');
var util = new utilConf();
//var user = mongoose.model('user');

/*  
 *   POST one user; 
 *   URL: /user/
 *   Cotent-Type: application/json
 *   JSON Create Example:
 * {
 *	"email": "cde@cde.com",
 *	"password": "senha123",
 *	"name": "jhonny cash",
 *	"role" : "admin"
 *  } 
 */
exports.register = function (req, res, db) {

    var hash = bcrypt.hashSync(req.body.password, 10);

    console.log('REGISTER');
    console.log('req.body.password', req.body.password);
    req.body.password = hash;
    console.log('req.body.password', req.body.password);

    db.collection('user').insert(req.body, function (err, result) {
        if (err) {
            res.send({
                'error': 'An error has occurred'
            });
        } else {
            res.send(result.ops[0]);
        }
    });

};

/*
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 * 
 */
exports.sign_in = function (req, res, db) {





    /*user.findOne({
     email: req.body.email
     }, function (err, user) {
     if (err)
     throw err;
     if (!user) {
     res.status(401).json({
     message: 'Authentication failed. User not found.'
     });
     } else if (user) {
     if (!user.comparePassword(req.body.password)) {
     res.status(401).json({
     message: 'Authentication failed. Wrong password.'
     });
     } else {
     return res.json({
     token: jwt.sign({
     email: user.email
     , fullName: user.fullName
     , _id: user._id
     }, 'RESTFULAPIs')
     });
     }
     }
     });*/
};

exports.edit = function (req, res, db) {
    var id = req.params.id;
    var details = {
        '_id': new ObjectID(id)
    };

    var hashpasswd = bcrypt.hashSync(req.body.password, 10);
    console.log('senha', req.body.password);
    var user = {
        'email': req.body.email,
        'password': hashpasswd
    };

    db.collection('user').update(details, user, function (err, result) {
        if (err) {
            res.send({
                'error': 'An error has occurred'
            });
        } else {
            util.authorization(req, res, db);           
        }
    });
}
exports.loginRequired = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({
            message: 'Unauthorized user!'
        });
    }
};