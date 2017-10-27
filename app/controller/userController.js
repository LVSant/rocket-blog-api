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
    util.decode(req, res);
    var loggedUserId = req.decoded.id;
    this.isUserAdmin(db, loggedUserId, function (userAdmin) {

        if (userAdmin) {
            var hash = bcrypt.hashSync(req.body.password, 10);
            req.body.password = hash;
            db.collection('user').insert(req.body, function (err, result) {
                if (err) {
                    res.send({
                        'error': 'An error has occurred'
                    });
                } else {
                    res.send(result.ops[0].id);
                }
            });
        } else
            res.sendStatus(403);
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
    util.decode(req, res);
    var loggedUserId = req.decoded.id;
    this.isUserAdmin(db, loggedUserId, function (userAdmin) {
        if (userAdmin) {
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
        } else
            res.send('You aren\'t an Admin').status(403);
    });
};

/*  
 *   PUT one user; URL: /user/id 
 */
exports.edit = function (req, res, db) {
    util.decode(req, res);
    var loggedUserId = req.decoded.id;

    this.isUserAdmin(db, loggedUserId, function (userAdmin) {
        var id = req.params.id;
        var details = {
            '_id': new ObjectID(id)
        };

        var hashpasswd = bcrypt.hashSync(req.body.password, 10);
        var user = {
            'email': req.body.email,
            'password': hashpasswd,
            'name': req.body.name,
            'role': req.body.role
        };

        if (userAdmin || id === loggedUserId) {
            db.collection('user').update(details, user, function (err, result) {
                if (err) {
                    res.send({
                        'error': 'An error has occurred'
                    });
                } else {
                    util.authorization(req, res, db);
                }
            });
        } else {
            res.sendStatus(403);
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
    db.collection('user').findOne(details, function (err, item) {
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
    db.collection('user').find({}).toArray(function (err, blogs) {
        if (err)
            throw err;
        res.send(blogs);
    });
};

exports.getAllAdmins = function (db, callback) {
    db.collection('user').find({role: 'admin'}).toArray(function (err, admins) {
        if (err)
            throw err;
        callback(admins);
    });
};

exports.isUserAdmin = function (db, userId, callback) {
    this.getAllAdmins(db, function (adminUsers) {
        var isUserAdmin = adminUsers.find(function (u) {
            return  u._id.equals(userId);
        });
        callback(isUserAdmin);
    });
};

exports.getMe = function (req, res, db) {
    util.decode(req, res);

    var loggedUserId = req.decoded.id;
    var details = {
        '_id': new ObjectID(loggedUserId)
    };
    db.collection('user').findOne(details, function (err, user) {
        if (err) {
            throw err;
        } else {
            if (user) {
                res.send({
                    "id": user["_id"],
                    "name": user["name"],
                    "email": user["email"],
                    "role": user["role "]
                });
            } else {
                res.status(403).send({"message": "User not found"});
            }
        }
    });

};
