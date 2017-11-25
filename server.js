var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var utilConf = require("./app/routes/util");
var util = new utilConf();
var mongoose = require('mongoose');

app.use(bodyParser.json({ limit: '10mb' }));

mongoose.Promise = global.Promise;
module.exports = app.listen(process.env.PORT || 8080, function () {

    if (util.isProdEnvironment()) {
        mongoose.connect(config.database, {
            useMongoClient: true
        });
        app.use(morgan('combined'));
        console.log('Connecting to Production database!');
    } else {
        mongoose.connect(config.databaseTest, {
            useMongoClient: true
        });
        app.use(morgan('dev'));
    }

    mongoose.connection.once('open', function () {
        util.setupEnvironment();
        require('./app/routes')(app);
    }).on('error', function () {
        console.log('Failed to connect to MongoDB!');
    });
});

module.app = app;