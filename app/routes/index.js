const noteRoutes = require('./blog_routes');
var express = require('express');
const app = express();

module.exports = function (app, db) {

  app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
    
    noteRoutes(app, db);
    
};