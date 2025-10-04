import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export function auth(req, res, next) {
    try {
        const token = req.headers.token || req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token not provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWTSECRET || "secretkey");

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token"
            })
        }

        req.decoded = decoded;
        next();
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

export function isadmin(req, res, next) {
    try {
        if (req.decoded.role === "admin") {
            next();
        } else {
            res.status(403).json({
                message: "Forbidden: Admin access only"
            });
        }
    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
}


export function isuser(req, res, next) {
    try {
        if (req.decoded.role === "user") {
            next();
        } else {
            res.status(403).json({
                message: "Forbidden: User access only"
            });
        }
    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
}