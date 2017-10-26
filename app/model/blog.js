var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Blog = new Schema({
    _id: Number,
    titleUrl: String,
    title: String,
    img: String,
    resumeContent: String,
    date: Date,
    author: String,
    creationDate: {type: Date, default: Date.now}
});

//module.exports = mongoose.model('user', User);
