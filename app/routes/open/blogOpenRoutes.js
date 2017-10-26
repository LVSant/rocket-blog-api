var controller = require('../../controller/blogController');

module.exports = function (app, db) {

    app.get('/post/:id', function (req, res) {
        controller.findBlogById(req, res, db);
    });

    app.get('/post', function (req, res) {
        controller.findAll(req, res, db);
    });
};
