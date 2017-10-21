var ObjectID = require('mongodb').ObjectID;
module.exports = function (app, db) {
    /*  
     *   GET one blog; URL: /blog/id 
     */
    app.get('/blog/:id', (req, res) => {
        const id = req.params.id;
        const details = {
            '_id': new ObjectID(id)
        };
        db.collection('blog').findOne(details, (err, item) => {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            }
            else {
                res.send(item);
            }
        });
    });
    /*  
     *   GET all blogs; URL: /blog/ 
     */
    app.get('/blog', (req, res) => {
        db.collection('blog').find({}).toArray(function (err, blogs) {
            if (err) throw error;
            res.send(blogs);
        });
    });
    /*  
     *   DELETE one blog; URL: /blog/id 
     */
    app.delete('/blog/:id', (req, res) => {
        const id = req.params.id;
        const details = {
            '_id': new ObjectID(id)
        };
        db.collection('blog').remove(details, (err, item) => {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            }
            else {
                res.send(item);
            }
        });
    });
    
    /*  
     *   PUT one blog; URL: /blog/id 
     */
    app.put('/blog/:id', (req, res) => {
        
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };                
        const blog = { text: req.params.text, title: req.params.title };
    db.collection('blog').update(details, blog, (err, result) => {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            }
            else {
                res.send(item);
            }
        });
    });

    
    /*  
     *   POST one blog; 
     *   URL: /addblog/
     *   Cotent-Type: application/json
     *   JSON Create Example:
     *   {
     *        "text": "outro",
     *        "title": "teste"
     *   }
     *
     */
    app.post('/addblog', function (req, res) {
        db.collection('blog').insert(req.body, (err, result) => {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            }
            else {
                res.send(result.ops[0]);
            }
        });
    });
};