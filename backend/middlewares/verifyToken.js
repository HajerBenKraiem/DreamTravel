const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    if (!req.headers.authorization) return res.status(403).json({ msg: 'NOT authorized. No token' });
    if (req.headers.authorization.startsWith("Bearer")) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) return res.status(403).json({ msg: "Wrong or Invalid token" });
            else {
                req.user = data; // an object with only the user._id and user.isAdmin 
                next();
            }
        });
    }
};

const verifyTokenAdmin = async (req, res, next) => {
    if (!req.headers.authorization) return res.status(403).json({ msg: 'NOT authorized. No token' });
    if (req.headers.authorization.startsWith("Bearer")) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) return res.status(403).json({ msg: "Wrong or Invalid token" });
            else {
                if (!data.isAdmin) {
                    return res.status(401).json({ msg: "You Are Not ADMIN" });
                }
                req.user = data; // an object with only the user._id and user.isAdmin 
                next();
            }
        });
    }
};

module.exports = { verifyToken, verifyTokenAdmin };
