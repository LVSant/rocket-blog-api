var controller = require('../../controller/userController');
module.exports = function (app, db) {
  
    app.delete('/user/:id', function (req, res) {
       controller.delete(req, res, db);
    });

    app.put('/user/:id', function (req, res) {
      controller.edit(req, res, db);
    });

    app.post('/user', function (req, res) {
        controller.register(req, res, db);
    });
};