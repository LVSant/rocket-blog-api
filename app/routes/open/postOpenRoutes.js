var controller = require('../../controller/postController');

module.exports = function (app, db) {

    app.get('/blog/post/:id', function (req, res) {
        controller.findPostById(req, res, db);
    });

    app.get('/blog/post', function (req, res) {
        if (req.query.category) {
            console.log('veio query');
            controller.findPostByCategory(req, res, db);
        } else {
            console.log('nao veio query');
            controller.getAllPostResume()(req, res, db);
        }
    });
};
