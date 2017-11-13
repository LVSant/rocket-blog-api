var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var postSchema = new Schema({
    _id: {type: ObjectId, ref: 'posts'},
    titleUrl: String,
    title: String,
    img: String,
    resumeContent: String,
    content: String,
    date: Date,
    author: String,
    category: String,
    creationDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('posts', postSchema);
