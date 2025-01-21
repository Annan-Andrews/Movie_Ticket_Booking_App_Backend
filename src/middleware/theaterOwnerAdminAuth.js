var jwt = require('jsonwebtoken');

const theaterOwnerAdminAuth = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Theater Owner/Admin not autherised", success: false });
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if (!tokenVerified) {
            return res.status(401).json({ message: "Theater Owner/Admin not autherised", success: false });
        }
        
        if(tokenVerified.role != 'theaterOwner' && tokenVerified.role !='admin'){
            return res.status(401).json({ message: "Theater Owner/Admin not autherised", success: false });
        }

        req.user = tokenVerified;

        next();
    } catch (error) {
        return res.status(401).json({ message: error.message || "Theater Owner/Admin autherization failed", success: false });
    }
};

module.exports = theaterOwnerAdminAuth

