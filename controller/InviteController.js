import mongoose from "mongoose";
import FormModel from "../model/FormModel.js"
import UserModel from "../model/UserModel.js";

class InviteController {

    async index(req, res){
        try {
            if(!req.params.id) { throw{ code:400, message: "REQUIRED_FORM_ID"}}
            if(!req.body.email) { throw{ code: 400, message: "REQUIRED_EMAIL"}}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw {code: 400, message:"INVALID_ID"}}

            const form = await FormModel.findOne(
                {_id: req.params.id, userId: req.jwt.id}).select("invites")
                if(!form) { throw{ code: 404, message: "INVITE_NOT_FOUND"}}

            return res.status(200)
                .json({
                    status: true,
                    message: "INVITE_FOUND",
                    form
                })
        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message
            });
        }
    }

    async store(req, res){
    try {
        if(!req.params.id) { throw{ code:400, message: "REQUIRED_FORM_ID"}}
        if(!req.body.email) { throw{ code: 400, message: "REQUIRED_EMAIL"}}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw {code: 400, message:"INVALID_ID"}}

        // user tidak bisa menambahkan email sendiri
        const user = await UserModel.findOne(
            {_id: req.jwt.id, email: req.body.email})
            if(user) { throw{ code: 400, message: "Cant_Invite_Yourself"}}

        // check email ready
        const emailInvite = await FormModel.findOne(
            {_id: req.params.id, userId: req.jwt.id, invites: {"$in": req.body.email}})
            if(emailInvite) { throw{ code: 400, message: "EMAIL_ALREADY_INVITED"}}

        // check email
        if(/[a-z0-9]+@[a-z]{2,3}/.test(req.body.email)=== false){
            throw {code: 400, message:"INVALID_EMAIL"}
        }

        const form = await FormModel.findOneAndUpdate(
            {_id: req.params.id, userId: req.jwt.id},
            {$push: {invites: req.body.email}},
            {new: true}                    
            )
        if(!form) { throw {code: 400, message: "INVITE_FAILED"}}
        return res.status(200)
            .json({
                status: true,
                message: "INVITE_EMAIL_SUCCESS",
                email: req.body.email
            })
    } catch (error) {
        return res.status(error.code || 500).json({
            status: false,
            message: error.message
        });
    }
    }

    async destroy(req, res){
        try {
            if(!req.params.id) { throw{ code:400, message: "REQUIRED_FORM_ID"}}
            if(!req.body.email) { throw{ code: 400, message: "REQUIRED_EMAIL"}}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw {code: 400, message:"INVALID_ID"}}

            const emailExists = await FormModel.findOne(
                {_id: req.params.id, userId: req.jwt.id, invites: {"$in": req.body.email}})
                if(!emailExists) { throw{ code: 404, message: "EMAIL_NOT_FOUND"}}

            const form = await FormModel.findOneAndUpdate(
                {_id: req.params.id, userId: req.jwt.id},
                {$pull: {invites: req.body.email}},
                {new: true}                    
                )
            if(!form) { throw {code: 400, message: "REMOVE_INVITE_FAILED"}}
            return res.status(200)
                .json({
                    status: true,
                    message: "REMOVE_EMAIL_SUCCESS",
                    email: req.body.email
                })
        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message
            });
        }
    }
}

export default new InviteController()