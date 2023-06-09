const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
    // Get token from header 
    const token = req.header('x-auth-token')

    // Check if no token
    if(!token) {
        return res.status(401).json({msg: 'No token, authorization denied'})
    }

    //Verify token
    try {
        //Decode token
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // To get the user's profile later anywhere from the token
        req.user = decoded.user;
        next();
    }catch (err) {
        res.status(401).json({msg: 'Token is not valid'})
    }
}