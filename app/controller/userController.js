var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
var User = require('../model/user');
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

    var details = {'_id': loggedUserId, 'role': {$in: ['admin', 'superadmin']}};

    User.find(details, function (err, users) {
        if (err)
            res.status(401).send({success: false, message: 'User is not admin'});
        if (users) {
            if (req.params['id']) {

                var id = req.params.id;
                var details = {'_id': new ObjectID(id)};
                User.remove(details, function (err) {
                    if (err)
                        res.status(500).send({success: false, message: 'Failed to delete user'});
                    res.status(200).send({success: true});
                });
            }
        }
    });

};

/*  
 *   PUT one user; URL: /admin/user/id 
 */
exports.edit = function (req, res, db) {
    util.decode(req, res, function () {

        var loggedUserId = req.decoded.id;
        module.exports.isUserAdmin(db, loggedUserId, function (userAdmin) {

            if (req.body.password) {
                var hashpasswd = bcrypt.hashSync(req.body.password, 10);
                //user['password'] = hashpasswd;
            }

            if (userAdmin || id === loggedUserId) {

                var query = {'username': req.user.username};
                //req.newData.username = req.user.username;
                User.findOneAndUpdate(query, req.newData, {upsert: true}, function (err, doc) {
                    if (err)
                        return res.send(500, {error: err});
                    //return res.send("succesfully saved");

                });
            } else
                res.status(403).send({'message': 'You aren\'t an Admin'});
        });
    });
};

/*db.collection('User').updateOne(
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
 });*/



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
 *   GET all users; URL: /user/ 
 */
exports.findAll = function (req, res) {
    User.find({}, '_id name email role date', function (err, users) {
        if (err) {
            res.status(500).send({success: false, message: 'Couldn\'t find users'});
        }
        if (users) {
            res.status(200).send({success: true, users: users});
        }
    });
};
exports.getAllAdmins = function (callback) {
//
};
exports.isUserAdmin = function (db, userId, callback) {
    module.exports.getAllAdmins(db, function (adminUsers) {
        var isUserAdmin = adminUsers.find(function (u) {
            return  u._id.equals(userId);
        });
        callback(isUserAdmin);
    });
};
exports.getMe = function (req, res) {
    util.decode(req, res, function () {
        var loggedUserId = req.decoded.id;
        var details = {
            '_id': new ObjectID(loggedUserId)
        };

        User.findOne(details, '_id name email role date', function (err, user) {
            if (err)
                res.status(403).send({success: false, message: "Unable to find user"});
            if (user) {
                res.status(200).send(user);
            }
        }).select();
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
exports.register = function (req, res) {
    util.decode(req, res);

    var loggedUserId = req.decoded.id;
    var details = {'_id': loggedUserId, 'role': {$in: ['admin', 'superadmin']}};

    User.find(details, function (err, users) {
        if (err) {
            res.status(401).send({success: false, message: 'User is not admin'});
        }
        if (users) {
            if (req.body['password'] !== undefined || req.body.password === '') {

                var hash = bcrypt.hashSync(req.body.password, 10);
                var newUser = new User({
                    _id: null,
                    name: req.body['name'],
                    email: req.body['email'],
                    role: req.body['role'],
                    password: hash,
                    date: new Date()
                });

                User.create(newUser, function (err, user) {
                    if (err) {
                        res.status(500).send({success: false, message: 'Couldn\'t create user'});
                    }
                    if (user) {
                        user.password = undefined;
                        res.status(200).send({success: true, user: user});
                    }
                });
            } else {
                res.status(500).send({success: false, message: 'Cannot create user: blank password'});
            }
        } else {
            res.status(401).send({success: false, message: 'User is not admin'});
        }
    });
};
