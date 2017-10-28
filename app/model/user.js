var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    _id: Number,
    name: String,
    email: String,
    role: String,
    password: String,
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);


/*module.exports = this.create({"name": "Snoopy",
 "email": "ab",
 "password": "ab",
 "role": "superadmin"
 }, function (err, userInstance) {
 if (err)
 throw err;
 
 });
 */



