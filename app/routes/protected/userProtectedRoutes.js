var ObjectID = require('mongodb').ObjectID;

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
        var id = req.params.id;
        var details = {
            '_id': new ObjectID(id)
        };
        //console.log('body ', req.body);

        var user = {
            'name': req.body.name,
            'password': req.body.password
        };

        db.collection('user').update(details, user, function (err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                res.send(result);
            }
        });
    });
    /*  
     *   POST one user; 
     *   URL: /user/
     *   Cotent-Type: application/json
     *   JSON Create Example:
     *   {
     *        "name": "userName",
     *        "password": "hashPassword",
     *        "isAdmin" : true or false
     *   }
     *
     */
    app.post('/user', function (req, res) {

        console.log('User ', req.body);

        db.collection('user').insert(req.body, function (err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                res.send(result.ops[0]);
            }
        });
    });
};