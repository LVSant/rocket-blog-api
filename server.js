const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
app.use(bodyParser.urlencoded({
    extended: true
}));
//app.listen(8000);

app.listen(process.env.PORT || 8080, () => {
            console.log('We are live on ' + port);
        });



console.log(" subiu no heroku ");

MongoClient.connect("mongodb://heroku_f7vnmk6r:heroku_f7vnmk6r@ ds125555.mlab.com:25555/heroku_f7vnmk6r", (err, database) => {
        if (err) return console.log(err)
        require('./app/routes')(app, database);
        
    })
    console.log("Hello World");