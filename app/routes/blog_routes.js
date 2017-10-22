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
                throw error;
            res.send(blogs);
        });
    });
    /*  
     *   DELETE one blog; URL: /blog/id 
     */
    app.delete('/blog/:id', function (req, res) {
        var id = req.params.id;
        var details = {
            '_id': new ObjectID(id)
        };
        db.collection('blog').remove(details, function (err, item) {
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
     *   PUT one blog; URL: /blog/id 
     */
    app.put('/blog/:id', function (req, res) {
        var id = req.params.id;
        var details = {
            '_id': new ObjectID(id)
        };
        console.log('body ', req.body);
        var blog = {
            'title': req.body.title
            , 'text': req.body.text
        }
        db.collection('blog').update(details, blog, function (err, result) {
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
     *   POST one blog; 
     *   URL: /blog/
     *   Cotent-Type: application/json
     *   JSON Create Example:
     *   {
     *        "text": "outro",
     *        "title": "teste"
     *   }
     *
     */
    app.post('/blog', function (req, res) {
        tokenize(req, res);
        db.collection('blog').insert(req.body, function (err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                //   res.send(result.ops[0]);
            }
        });
    });
};