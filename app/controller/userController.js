var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
var utilConf = require('../routes/util');
var util = new utilConf();

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
    req.body.password = hash;
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
 * validates user and generates a token.
 */
exports.sign_in = function (req, res, db) {
    util.authorization(req, res, db);
};

/*  
 *   DELETE one user; URL: /user/id 
 */
exports.delete = function (req, res, db) {
    var id = req.params.id;
    var details = {
        '_id': new ObjectID(id)
    };
    db.collection('user').remove(details, function (err, item) {
        if (err) {
            res.send({
                'error': 'An error has occurred'
            });
        } else {
            res.send(item);
        }
    });
};

/*  
 *   PUT one user; URL: /user/id 
 */
exports.edit = function (req, res, db) {
    var id = req.params.id;
    var details = {
        '_id': new ObjectID(id)
    };

    var hashpasswd = bcrypt.hashSync(req.body.password, 10);
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
};
exports.loginRequired = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({
            message: 'Unauthorized user!'
        });
    }
};

/*  
 *   GET one blog; URL: /blog/id 
 */
exports.findUserById = function (req, res, db) {
    var id = req.params.id;
    var details = {
        '_id': new ObjectID(id)
    };
    db.collection('blog').findOne(details, function (err, item) {
        if (err) {
            res.send({
                'error': 'An error has occurred'
            });
        } else {
            res.send(item);
        }
    });
};

/*  
 *   GET all blogs; URL: /blog/ 
 */
exports.findAll = function (req, res, db) {
    db.collection('blog').find({}).toArray(function (err, blogs) {
        if (err)
            throw err;
        res.send(blogs);
    });
};
