var mongoose = require('mongoose');
 var Schema = mongoose.Schema;


 var User = new Schema({
   _id: Number,
 name: String,
 username: String,
 email: String,
 password: String,
 creationDate: {type: Date, default: Date.now}
 });

 //module.exports = mongoose.model('user', User);
