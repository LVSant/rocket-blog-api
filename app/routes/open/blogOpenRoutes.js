var controller = require('../../controller/blogController');

module.exports = function (app, db) {

    app.get('/blog/post/:id', function (req, res) {
        controller.findBlogById(req, res, db);
    });

    app.get('/blog/post', function (req, res) {
        
        if (req.query.category) {
            console.log('veio query');
            controller.findPostByCategory(req, res, db);
        } else {
            console.log('nao veio query');
            controller.getAllBlogResume(req, res, db);
        }
    });
};
