var controller = require('../../controller/blogController');
module.exports = function (app, db) {
    app.delete('/admin/post/:id', function (req, res) {
        controller.delete(req, res, db);
    });
    app.put('/admin/post/:id', function (req, res) {
        controller.edit(req, res, db);
    });
    app.post('/admin/post', function (req, res) {
        controller.create(req, res, db);
    });
};

