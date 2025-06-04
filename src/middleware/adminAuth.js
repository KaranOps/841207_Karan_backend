const jwt = require('jsonwebtoken');
const admin = require('../models/admin');

exports.verifyAdmin = async (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Unauthorized, login again" });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check admin exists
        const user = await admin.findById(decoded.id);
        if (!user) return res.status(401).json({ success: false, message: "Unauthorized, login again" });

        // Attach user to request
        req.admin = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Not authorized' });
    }
};
