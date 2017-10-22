# Blog Rocket - API

API designed for an exercise of lecture 'Science, Technology and Society' of UNICAMP-FT.
Using Node.js, Express, Mongoose, JWT

### Prerequisites

Set $MONGODB_URI with your mongodb driver via the standard [MongoDB URI](http://docs.mlab.com/connecting/#connect-string)

npm install

## Deployment

git push heroku master
heroku open

## Routes

- GET one blog 
URL: /blog/id

- GET all blogs 
URL: /blog/ 

- DELETE one blog
URL: /blog/id 

- PUT one blog
URL: /blog/id 
JSON parameter example:
    {
        "_id": "blogid",
        "text": "newcontent",
        "title": "newtitle"
    } 

- POST one blog; 
URL: /addblog/
Cotent-Type: application/json
JSON parameter example:
    {
        "text": "blogcontent",
        "title": "blogtitle"
    }
JSON response example:
    {
        "_id": "blogid",
        "text": "blogcontent",
        "title": "blogtitle"
    } 
     
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments


