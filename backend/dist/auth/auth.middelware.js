import jwt from 'jsonwebtoken';
const options = {
    httpOnly: true,
    maxAge: Number(process.env.COOKIE_ACCESS_MAX_AGE),
    domain: process.env.CLIENT_DOMAIN,
    secure: process.env.NODE_ENV === "dev" ? false : true,
    sameSite: "lax"
};
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }
    catch (err) {
        res.clearCookie("accessToken", options);
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Access token expired",
            });
        }
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
