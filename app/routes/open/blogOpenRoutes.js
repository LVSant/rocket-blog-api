var controller = require('../../controller/userController');

module.exports = function (app, db) {

    app.get('/blog/:id', function (req, res) {
        controller.findUserById(req, res, db);
    });

    app.get('/blog', function (req, res) {
        controller.findAll(req, res, db);
    });
};