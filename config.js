module.exports = {
    'jwtSecret': process.env.JWTSECRET,
    'jwtSession': {session: false},
    'database': process.env.MONGODB_URI,
    'databaseTest': process.env.MONGODB_TEST_URI ,
    'userAdminPassword' : process.env.SUPERSECRET_PASSWD
};
