var controller = require('../../controller/postController');

module.exports = function (app) {

    app.get('/blog/post/:id', function (req, res) {
        controller.findPostById(req, res);
    });

    app.get('/blog/post', function (req, res) {
        controller.getPostsQuery(req, res);
    });
};
