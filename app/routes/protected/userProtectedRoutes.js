var controller = require('../../controller/userController');
module.exports = function (app, db) {

    app.delete('/admin/user/:id', function (req, res) {
        controller.delete(req, res, db);
    });

    app.put('/admin/user/:id', function (req, res) {
        controller.edit(req, res, db);
    });

    app.post('/admin/user', function (req, res) {
        controller.register(req, res, db);
    });

    app.get('/admin/me', function (req, res) {
        controller.getMe(req, res, db);
    });
    /*  
     *   GET one user; URL: /user/id 
     */
    app.get('/admin/user/:id', function (req, res) {
        controller.findUserById(req, res, db);
    });
    /*  
     *   GET all users; URL: /user/ 
     */
    app.get('/admin/user', function (req, res) {
        controller.findAll(req, res, db);
    });

};