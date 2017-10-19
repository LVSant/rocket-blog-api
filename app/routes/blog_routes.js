module.exports = function (app, db) {

    app.get('/blog/:id', (req, res) => {
    
  });
    
    
    app.get('/blog', (req, res) => {
        db.collection('blog').find({}).toArray(function(err, blogs) {
        
            if(err) throw error;                                                   
            res.send(blogs);
        });
  });
    
    app.post('/addblog', (req, res) => {
        const note = {
            text: req.body.body
            , title: req.body.title
        };
        
        db.collection('blog').insert(note, (err, result) => {
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