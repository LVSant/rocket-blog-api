var ObjectID = require('mongodb').ObjectID;
var controller = require('../../controller/userController');

module.exports = function (app, db) {
    /*  
     *   GET one user; URL: /user/id 
     */
    app.get('/user/:id', function (req, res) {
        var id = req.params.id;
        var details = {
            '_id': new ObjectID(id)
        };

        db.collection('user').findOne(details, function (err, item) {
            if (err) {
                res.send({
                    'error': 'Could not find user!'
                });
            } else {
                res.send(item);
            }
        });
    });
    /*  
     *   GET all users; URL: /user/ 
     */
    app.get('/user', function (req, res) {
        db.collection('user').find({}).toArray(function (err, users) {
            if (err)
                throw err;
            res.send(users);
        });
    });
    
};