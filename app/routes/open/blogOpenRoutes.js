var ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {
    /*  
     *   GET one blog; URL: /blog/id 
     */
    app.get('/blog/:id', function (req, res) {
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
    });
    /*  
     *   GET all blogs; URL: /blog/ 
     */
    app.get('/blog', function (req, res) {
        db.collection('blog').find({}).toArray(function (err, blogs) {
            if (err)
                throw err;
            res.send(blogs);
        });
    });
};