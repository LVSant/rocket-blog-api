var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
var User = require('../model/user');
var utilConf = require('../routes/util');
var util = new utilConf();

/*  
 *   DELETE one user; URL: /admin/user/id 
 */
exports.delete = function (req, res) {

    util.decode(req, res, function () {
        var loggedUserId = req.decoded.id;

        var details = { '_id': loggedUserId, 'role': { $in: ['admin', 'superadmin'] } };

        User.find(details, function (err, users) {
            if (err)
                res.status(401).send({ success: false, message: 'User is not admin' });
            if (users) {
                if (req.params['id']) {

                    var id = req.params.id;
                    var details = { '_id': new ObjectID(id) };
                    User.remove(details, function (err) {
                        if (err)
                            res.status(500).send({ success: false, message: 'Failed to delete user' });
                        res.status(200).send({ success: true });
                    });
                }
            }
        });
    });
};

/*  
 *   PUT one user; URL: /admin/user/id 
 */
exports.edit = function (req, res) {
    util.decode(req, res, function () {
        var loggedUserId = req.decoded.id;
        var editUserId = req.params.id;
        var details = { '_id': loggedUserId };

        User.findOne(details, function (err, userAdmin) {
            if (err)
                res.status(500).send({ success: false, message: 'Failed to find logged user' });
            if (userAdmin.role === 'admin' || userAdmin.role === 'superadmin' || loggedUserId === editUserId) {
                if (req.params['id'] !== undefined) {
                    User.findById(editUserId, function (err, user) {
                        if (err)
                            res.status(500).send({ success: false, message: 'Failed to find user to update' });

                        var newName = req.body['name'];
                        var newEmail = req.body['email'];
                        var newRole = req.body['role'];
                        var newPassword = req.body['password'];

                        if (newName)
                            user.name = req.body['name'];

                        if (newEmail)
                            user.email = req.body['email'];

                        if (newRole)
                            user.role = req.body['role'];

                        if (newPassword) {
                            var hashpasswd = bcrypt.hashSync(req.body.password, 10);
                            user.password = hashpasswd;
                        }

                        user.save(function (err, updatedUser) {
                            if (err)
                                res.status(500).send({ success: false, message: 'Failed to update user' });
                            updatedUser.password = undefined;

                            if (hashpasswd) {
                                util.authorization(req, res);
                            }
                            else {
                                res.status(200).send(updatedUser);
                            }
                        });
                    });
                } else {
                    res.status(500).send({ success: false, message: 'Invalid id provided' });
                }
            } else
                res.status(403).send({ success: false, message: 'You aren\'t an Admin' });
        });
    });
};

/*  
 *   GET all users; URL: /admin/user/ 
 */
exports.findAll = function (req, res) {
    User.find({}, '_id name email role date', function (err, users) {
        if (err) {
            res.status(500).send({ success: false, message: 'Couldn\'t find users' });
        }
        if (users) {
            res.status(200).send({ success: true, users: users });
        }
    });
};
/*  
 *   GET one user; URL: /admin/user/id
 */
exports.findUserById = function (req, res) {
    User.find({ _id: req.params.id }, '_id name email role date', function (err, user) {
        if (err) {
            res.status(500).send({ success: false, message: 'Couldn\'t find users' });
        }
        if (user) {
            res.status(200).send({ success: true, user: user });
        }
    });
};

exports.isUserAdmin = function (db, userId, callback) {
    module.exports.getAllAdmins(db, function (adminUsers) {
        var isUserAdmin = adminUsers.find(function (u) {
            return u._id.equals(userId);
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
                res.status(403).send({ success: false, message: "Unable to find user" });
            if (user) {
                res.status(200).send(user);
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
exports.register = function (req, res) {
    util.decode(req, res, function () {

        var loggedUserId = req.decoded.id;
        var details = { '_id': loggedUserId, 'role': { $in: ['admin', 'superadmin'] } };

        User.findOne(details, function (err, user) {
            if (err) {
                res.status(401).send({ success: false, message: 'User is not admin' });
            }
            if (user) {
                if (req.body['password']) {

                    var hash = bcrypt.hashSync(req.body.password, 10);
                    var newUser = new User({
                        _id: new ObjectID(),
                        name: req.body['name'],
                        email: req.body['email'],
                        role: req.body['role'],
                        password: hash,
                        date: new Date()
                    });

                    User.create(newUser, function (err, user) {
                        if (err) {
                            res.status(500).send({ success: false, message: 'Couldn\'t create user' });
                        }
                        if (user) {
                            user.password = undefined;
                            res.status(200).send({ success: true, user: user });
                        }
                    });
                } else {
                    res.status(500).send({ success: false, message: 'Cannot create user: blank password' });
                }
            } else {
                res.status(401).send({ success: false, message: 'User is not admin' });
            }
        });
    });
};
