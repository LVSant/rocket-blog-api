var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: {type: ObjectId, ref: 'users'},
    name: String,
    email: String,
    role: String,
    password: String,
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('users', userSchema);
