import User from "../model/UserModel.js";
import EmailExits from "../libaries/EmailExits.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from 'dotenv';

const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
    return jsonwebtoken.sign(
        payload,
        env.JWT_ACCESS_TOKEN_SECRET,
        {expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME})
}

const generateRefreshToken = async (payload) => {
    return jsonwebtoken.sign(
        payload,
        env.JWT_REFRESH_TOKEN_SECRET,
        {expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME})
}

class AuthController {
    async register(req, res) {
        try {
            // validasi reuired
            const requiredFields = ['fullname', 'email', 'password'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ status: false, message: `${field} is required` });
                }
            }
             // validasi password kurang dari 6
            if(req.body.password.length < 6) { throw { code:400, message: 'PASSWORD_MINIMUM_6_CHARAGTHER'}}

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);

            // validasi jika email sudah ada
            const emailExists = await EmailExits(req.body.email);
            if (emailExists) {
                return res.status(409).json({ status: false, message: 'EMAIL_ALREADY_EXISTS' });
            }

            const user = await User.create({
                fullname: req.body.fullname, 
                email: req.body.email,
                password: hash,
            });

            if (!user) {
                throw {
                    code: 500,
                    message: 'USER_REGISTER_FAILED'
                };
            }

            return res.status(200).json({
                status: true,
                message: 'USER REGISTER SUCCESS',
                user
            });
        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message
            });
        }
    }

    async login(req, res){
        try {
            const loginfields = ['email', 'password']
            for (var field of loginfields){
                 if (!req.body[field]) {
                    return res.status(400).json({ message: `${field} is required` });
                }
            }

            const user = await User.findOne({ email: req.body.email })
            if(!user) { throw { code:400, message: 'USER_NOT_FOUND' }}

            const ifPasswordValid = await bcrypt.compare(req.body.password, user.password)
            if(!ifPasswordValid) { throw{
                code:400,
                message: 'INVALID_PASSWORD'
            }}

            const accessToken = await generateAccessToken({id: user._id})
            const refreshToken = await generateRefreshToken({id: user._id})

            return res.status(200)
                .json({
                    status:true,
                    message: 'USER_LOGIN_SUKSES',
                    fullname: user.fullname,
                    accessToken,
                    refreshToken
                })
        } catch (error) {
            return res.status(error.code || 500)
                .json({
                    status:false,
                    message: error.message
                })
        }
    }

    async refreshToken(req, res) {
        try {
            if(!req.body.refreshToken) {
                throw{
                    code: 400,
                    message: 'REFRESH_TOKEN_IS_REQUIRED'
                }}    
            const verifiy = await jsonwebtoken.verify(
                req.body.refreshToken,
                env.JWT_REFRESH_TOKEN_SECRET
            )
            let payload = {id: verifiy.id}
            const accessToken = await generateAccessToken(payload)
            const refreshToken = await generateRefreshToken(payload)
            return res.status(200)
                .json({
                    status:true,
                    message: 'REFRESH_TOKEN_SUCCESS',
                    accessToken,
                    refreshToken
                })
        } catch (error) {
            const errorJwt = [
                'invalid signature', 
                'jwt malformed',
                'jwt must be provided',
                'invalid token',
            ]

            if(error.message == 'jwt expired'){
                error.message = 'REFRESH_TOKEN_EXPIRED'
            }else if(errorJwt.includes(error.message)){
                error.message = 'INVALID_REFRESH_TOKEN'
            }

            return res.status(error.code || 500)
            .json({
                status:false,
                message: error.message
            })
        }
    }
}

export default new AuthController();
