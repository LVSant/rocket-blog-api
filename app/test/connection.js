var mongoose = require('mongoose');
var config = require('../../config');
mongoose.Promise = global.Promise;

before(function (done) {
    //Connect to MongoDB Here
    mongoose.connect(config.databaseTest, {
        useMongoClient: true
    });

    mongoose.connection.once('open', function () {
        console.log('Connected to MongoDB - Test!');
        done();
    }).on('error', function () {
        console.log('Failed to connect to MongoDB - Test!');
    });
});

/*beforeEach(function (done) {
 //mongoose.connection.collections.Post.drop(function () {
 //console.log('removendo');
 done();
 //});
 });*/