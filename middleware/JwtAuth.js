import jsonwebtoken from "jsonwebtoken";
import dotenv from 'dotenv';

const env = dotenv.config().parsed;

const jwtAuth = () => {
    return async (req, res, next) => {
        try {
            if (!req.headers.authorization) {
                throw {
                    code: 401,
                    message: 'Unauthorized'
                };
            }

            const token = req.headers.authorization.split(' ')[1]; // Perbaiki penulisan 'spilt' menjadi 'split'
            const decoded = jsonwebtoken.verify(token, env.JWT_ACCESS_TOKEN_SECRET);
            req.jwt = decoded; // Perbaiki penulisan 'verify' menjadi 'decoded'
            next();
        } catch (error) {
            const errorJwt = [
                'invalid signature',
                'jwt malformed',
                'jwt must be provided',
                'invalid token',
            ];

            if (error.message === 'jwt expired') {
                error.message = 'REFRESH_TOKEN_EXPIRED';
            } else if (errorJwt.includes(error.message)) {
                error.message = 'INVALID_REFRESH_TOKEN';
            }

            return res.status(error.code || 500)
                .json({
                    status: false,
                    message: error.message
                });
        }
    };
}

export default jwtAuth;
