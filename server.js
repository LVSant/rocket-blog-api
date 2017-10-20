const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const app = express();
const port = 8080;



app.use(bodyParser.urlencoded({
    extended: true
}));


app.listen(process.env.PORT || 8080, () => {
            console.log('We are live on ' + port);
        });


console.log(" subiu no heroku ");
console.log(process.env.MONGODB_URI);


mongodb.MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
        if (err) return console.log(err)
        require('./app/routes')(app, database);
        
    })
    console.log("Hello World");