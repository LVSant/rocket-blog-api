module.exports = function (app, db) {

    app.get('/blog/:id', (req, res) => {
    
  });
    
    
    app.get('/blog', (req, res) => {
        db.collection('blog').find({}).toArray(function(err, blogs) {
        
            if(err) throw error;                                                   
            res.send(blogs);
        });
  });
    
    app.post('/addblog', function(req, res) {
            
        
        
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