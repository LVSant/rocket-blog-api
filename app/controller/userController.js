var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
var utilConf = require('../routes/util');
var util = new utilConf();



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

            db.collection('User').remove(details, function (err, item) {
                if (err) {
                    res.send({
                        'error': 'An error has occurred'
                    });
                } else {
                    res.send(item);
                }
            });
        } else
            res.status(403).send({'message': 'You aren\'t an Admin'});
    });
};

/*  
 *   PUT one user; URL: /admin/user/id 
 */
exports.edit = function (req, res, db) {
    util.decode(req, res, function () {

        var loggedUserId = req.decoded.id;
        module.exports.isUserAdmin(db, loggedUserId, function (userAdmin) {

            var id = req.params.id;
            var details = {
                '_id': new ObjectID(id)
            };

            var user = {
                'name': req.body.name,
                'role': req.body.role
            };

            /* if (req.body.password) {
             var hashpasswd = bcrypt.hashSync(req.body.password, 10);
             user['password'] = hashpasswd;
             }*/
            if (userAdmin || id === loggedUserId) {
                db.collection('User').updateOne(
                        details,
                        {$set: {
                                name: user.name,
                                role: user.role
                            }
                        },
                        function (err, callback) {
                            if (err) {
                                res.send({'error': 'An error has occurred trying to update an User'});
                            } else {
                                if (callback["result"].n > 0) {
                                    res.status(200).send({success: true, message: 'User updated successfully'});
                                } else {
                                    res.status(500).send({success: false, message: 'User not found'});
                                }
                            }
                        });
            } else {
                res.status(403).send({'message': 'You aren\'t an Admin'});
            }
        });
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
 *   GET one user; URL: /admin/user/id 
 */
exports.findUserById = function (req, res, db) {
    var id = req.params.id;
    var details = {
        '_id': new ObjectID(id)
    };
    db.collection('User').findOne(details, function (err, item) {
        if (err) {
            res.send({'error': 'An error has occurred trying to find an User'});
        } else {
            res.send(item);
        }
    });
};

/*  
 *   GET all blogs; URL: /blog/ 
 */
exports.findAll = function (req, res, db) {
    db.collection('User').find({}).toArray(function (err, blogs) {
        if (err)
            throw err;
        res.send(blogs);
    });
};

exports.getAllAdmins = function (db, callback) {
    db.collection('User').find({role: {$in: ['admin', 'superadmin']}}).toArray(function (err, admins) {
        if (err)
            throw err;
        callback(admins);
    });
};

exports.isUserAdmin = function (db, userId, callback) {
    module.exports.getAllAdmins(db, function (adminUsers) {
        var isUserAdmin = adminUsers.find(function (u) {
            return  u._id.equals(userId);
        });
        callback(isUserAdmin);
    });
};

exports.getMe = function (req, res, db) {
    util.decode(req, res, function () {
        var loggedUserId = req.decoded.id;
        var details = {
            '_id': new ObjectID(loggedUserId)
        };
        db.collection('User').findOne(details, function (err, user) {
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

    });
};

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
    module.exports.isUserAdmin(db, loggedUserId, function (userAdmin) {

        if (userAdmin) {
            var hash = bcrypt.hashSync(req.body.password, 10);
            req.body.password = hash;
            db.collection('User').insert(req.body, function (err, result) {
                if (err)
                {
                    res.send({
                        'error': 'An error has occurred'
                    });
                } else {
                    res.send(result.ops[0].id);
                }
            });
        } else
            res.status(403).send({'message': 'You aren\'t an Admin'});
    });
};
