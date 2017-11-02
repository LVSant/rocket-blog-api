module.exports = {
    'jwtSecret': process.env.JWTSECRET || '0727FCALjkVA48PCxPPtyaPBsWid1MU6PzOHLNUsXRV8ibR7NVo6pTCwnxFivP6IKGF78G',
    'jwtSession': {session: false},
    'database': process.env.MONGODB_URI || 'mongodb://mongo_admin:mongo_admin@localhost:27017/rocketBlogAPITest',
    'userAdminPassword' : process.env.SUPERSECRET_PASSWD || 'ab'
};