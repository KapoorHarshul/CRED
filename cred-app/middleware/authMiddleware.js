const jwt = require("jsonwebtoken");

// Middleware to authenticate user using JWT
const authMiddleware = (req, res, next) => {
    const token =
        req.header("Authorization")?.split(" ")[1] ||  // Extract token from "Authorization" header
        req.header("x-auth-token");  // Support "x-auth-token" as well

    if (!token) {
        return res.status(403).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify token with the secret
        req.user = decoded;  // Attach the decoded user data to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ message: "Invalid token, authorization denied" });
    }
};

module.exports = authMiddleware;
