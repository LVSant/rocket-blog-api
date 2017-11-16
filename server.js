var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var config = require('./config');
var utilConf = require("./app/routes/util");
var util = new utilConf();

app.use(bodyParser.json());
app.use(morgan('dev'));

mongoose.Promise = global.Promise;
module.exports = app.listen(process.env.PORT || 8080, function () {


    mongoose.connect(config.databaseTest, {
        useMongoClient: true
    });

    mongoose.connection.once('open', function () {
        console.log('Connected to Production database!');
        util.setupEnvironment();
        require('./app/routes')(app);
    }).on('error', function () {
        console.log('Failed to connect to MongoDB - Production!');
    });


});

module.app = app;