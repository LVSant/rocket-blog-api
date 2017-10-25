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
};