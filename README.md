# Blog Rocket - API [![Build Status](https://travis-ci.org/leonardoviveiros/rocket-blog-api.svg?branch=master)](https://travis-ci.org/leonardoviveiros/rocket-blog-api)

Backend API designed for an exercise of lecture 'Science, Technology and Society' of UNICAMP-FT State University of Campinas

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

In order to build the project, it's necessary to have isntalled in your system the following packages:

 - npm@5.5.1
 - node@8.9.1

### Installing

#### Clone the repository
```
git clone https://github.com/leonardoviveiros/rocket-blog-api.git
```

#### Enter the directory
```
cd rocket-blog-api/
```

#### Install the dependencies
```
npm install
```

#### Set up environment variables 
There are four necessary variables used, and for safety purpouses, their values are only on the server
In order to run the project locally, we need to set the values of this variables.

The variables are:
- jwtSecret - Contains the secret password used in JsonWebToken
- database - MongoLab URL to the Production database
- databaseTest - MongoLab URL to the Test database
- userAdminPassword - The password used to create the SuperAdmin user, in the case there isn't one

All this variables can be found in the file ./config.js

## Running the tests
```
npm run test
```

## Running locally

In order to run the project on http://localhost:8080 with the test database, run:
```
npm run dev
```

To connect using the production database and production environment, run:
```
npm run start
```

## Deployment
This project is configured to deploy automatically on Heroku after the CI tests passed
See [Travis CI Heroku deploy documentation](https://docs.travis-ci.com/user/deployment/heroku/) for details


## Dependencies
Vide package.json

## Contributing
Contributions are welcome.
Fork and make a pull request with information about the change. 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

**<>** with :heart: by Leonardo Viveiros

