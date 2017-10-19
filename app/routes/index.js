const noteRoutes = require('./blog_routes');
module.exports = function (app, db) {
    noteRoutes(app, db);
    //other routes group should go here
};