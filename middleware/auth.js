const jwt = require("jsonwebtoken");
const config = require("config");

// Middleware function - takes: req, res and next
// next - it's call back that we have to run when we done, so it moves on next piece of middleware
module.exports = function(req, res, next) {
    // Get token from header - when we send the request to the protected route, we need to send the token within the header
    const token = req.header("x-auth-token");

    //Check if no token
    if(!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    //Verify token
    try {
        //This will decode the token
        const decoded = jwt.verify(token, config.get("jwtSecret"));

        //now we take the request object and assign the value to user
        //decoded value has "user" object in payload with its id
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token is not valid" });
    }
}