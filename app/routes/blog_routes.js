module.exports = function (app, db) {

    app.get('/notes/:id', (req, res) => {
    
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