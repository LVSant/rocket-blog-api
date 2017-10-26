var controller = require('../../controller/userController');

module.exports = function (app, db) {

    app.get('/post/:id', function (req, res) {
        controller.findUserById(req, res, db);
    });

    app.get('/post', function (req, res) {
        controller.findAll(req, res, db);
    });
};
