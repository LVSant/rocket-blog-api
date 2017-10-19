const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const app = express();
const port = 8080;


var uri = 'mongodb://heroku_f7vnmk6r:dipmsrg72u14je61vc3ebpg4r@ds125555.mlab.com:25555/heroku_f7vnmk6r';


app.use(bodyParser.urlencoded({
    extended: true
}));




app.listen(process.env.PORT || 8080, () => {
            console.log('We are live on ' + port);
        });



console.log(" subiu no heroku ");



mongodb.MongoClient.connect(uri, (err, database) => {
        if (err) return console.log(err)
        require('./app/routes')(app, database);
        
    })
    console.log("Hello World");