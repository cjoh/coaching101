const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-coaching101-secret';
const COOKIE_NAME = 'coach_session';
const TOKEN_DURATION_DAYS = 7;

const hashPassword = async password => {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hash) => bcrypt.compare(password, hash);

const signToken = user =>
    jwt.sign(
        {
            id: user.id,
            role: user.role || 'participant'
        },
        JWT_SECRET,
        {
            expiresIn: `${TOKEN_DURATION_DAYS}d`
        }
    );

const setAuthCookie = (res, token) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: isProduction ? 'strict' : 'lax',
        secure: isProduction,
        maxAge: TOKEN_DURATION_DAYS * 24 * 60 * 60 * 1000
    });
};

const clearAuthCookie = res => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, '', {
        httpOnly: true,
        sameSite: isProduction ? 'strict' : 'lax',
        secure: isProduction,
        expires: new Date(0)
    });
};

const authenticate = (req, res, next) => {
    const token =
        req.cookies?.[COOKIE_NAME] ||
        (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : null);

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: payload.id,
            role: payload.role
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired session' });
    }
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

module.exports = {
    hashPassword,
    verifyPassword,
    signToken,
    setAuthCookie,
    clearAuthCookie,
    authenticate,
    requireAdmin,
    COOKIE_NAME
};
