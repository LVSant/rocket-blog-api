var ObjectID = require('mongodb').ObjectID;
var controller = require('../../controller/userController');
module.exports = function (app, db) {
    /*  
     *   DELETE one user; URL: /user/id 
     */
    app.delete('/user/:id', function (req, res) {
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
    });
    /*  
     *   PUT one user; URL: /user/id 
     */
    app.put('/user/:id', function (req, res) {
      controller.edit(req, res, db);
    });

    app.post('/user', function (req, res) {
        controller.register(req, res, db);
    });
};