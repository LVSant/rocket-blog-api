var controller = require('../../controller/postController');

module.exports = function (app) {

    app.get('/blog/post/:url', function (req, res) {
        controller.findPostByURL(req, res);
    });

    app.get('/blog/post', function (req, res) {
        controller.getPostsQuery(req, res);
    });
};
