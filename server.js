var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var morgan = require('morgan');
var config = require('./config');
var auth = require("./auth.js")();

app.use(bodyParser.json());
app.use(auth.initialize());
app.use(morgan('dev'));
app.listen(process.env.PORT || 8080, function () {
    console.log('Rocket Blog API is Live!');
});

mongodb.MongoClient.connect(config.database, function (err, database) {
    if (err)
        throw (err);

    require('./app/routes')(app, database);
});
