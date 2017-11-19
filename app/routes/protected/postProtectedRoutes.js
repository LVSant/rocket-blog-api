var controller = require('../../controller/postController');
module.exports = function (app) {
    app.delete('/admin/post/:id', function (req, res) {
        controller.delete(req, res);
    });
    app.put('/admin/post/:id', function (req, res) {
        controller.edit(req, res);
    });
    app.post('/admin/post', function (req, res) {
        controller.create(req, res);
    });
    app.get('/admin/post', function(req, res){
        controller.findPostAdmin(req, res);
    });
};

