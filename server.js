var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var morgan = require('morgan');
var config = require('./config');
var auth = require("./auth")();
var utilConf = require("./app/routes/util");
var util = new utilConf();

app.use(bodyParser.json());
app.use(auth.initialize());
app.use(morgan('dev'));
app.listen(process.env.PORT || 8080, function () {

    var connect = function (callback) {
        mongoose.connect(config.database, {
            useMongoClient: true
        });
        callback(mongoose.connection);
    };
    console.log('Rocket Blog API is Live!');

//    if (util.isDevEnvironment()) {

    connect(function (db) {
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));

        console.log('setup');
        
        util.setupEnvironment(db);
        require('./app/routes')(app, db);
    });
    //  }

});


//util.setupEnvironment();



/*mongodb.MongoClient.connect(config.database, function (err, database) {
 if (err)
 throw (err);
 
 require('./app/routes')(app, database);
 });
 
 */