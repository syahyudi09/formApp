import mongoose from "mongoose";
import FormModel from "../model/FormModel.js";

class FormController {

    async index(req, res){
        try {

            const limit = parseInt(req.query.limit) || 10
            const page = parseInt(req.query.page) || 1
            const form = await FormModel.paginate(
                {
                    userId: req.jwt.id,
                },
                {
                    limit: limit,
                    page: page
                }
            )
            if(!form){
                throw{
                    code :400,
                    message: 'FORMS_NOT_FOUND'
                }
            }
            return res.status(200).json({
                status: true,
                message: 'SUCCESS_GET_FORMS',
                form
            })
        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message
            });
        }
    }

    async store(req, res) {
        try {
            const form = await FormModel.create({
                userId: req.jwt.id,
                title: 'Untitled Form', // Fixed the typo in 'title'
                description: null,
                isPublic: true, // Changed 'public' to 'isPublic'
            });
            if (!form) {
                throw {
                    code: 500,
                    message: "FAILED_CREATE_FORM",
                };
            }
            return res.status(201).json({ // Changed status code to 201 for resource creation
                status: true,
                message: "SUCCESS_CREATE_FORM",
                form,
            });
        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message,
            });
        }
    }

    async show(req, res){
    try {
        if(!req.params.id) {
            throw{
                code :400,
                message: 'REQUIRED_FROM_ID'
            }
        }

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            throw{
                code :400,
                message: 'INVALID_ID'
            }
        }

        const form = await FormModel.findOne(
            {
                _id: req.params.id,
                userId: req.jwt.id
            }
        )
        if(!form){
            throw{
                code :400,
                message: 'FORM_NOT_FOUND'
            }
        }
        return res.status(200).json({
            status: true,
            message: 'SUCCESS_GET_FORM',
            form
        })
      } catch (error) {
        return res.status(error.code || 500).json({
            status: false,
            message: error.message
        });
      }
    }

    async update(req, res) {
        try {
            if (!req.params.id) {
                throw {
                    code: 400,
                    message: 'REQUIRED_FROM_ID'
                }
            }
    
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                throw {
                    code: 400,
                    message: 'INVALID_ID'
                }
            }
    
            const form = await FormModel.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId: req.jwt.id
                },
                req.body,
                { new: true }
            );
    
            if (!form) {
                throw {
                    code: 400,
                    message: 'FORM_UPDATE_FAILED'
                };
            }
    
            return res.status(200).json({
                status: true,
                message: 'FORM_UPDATE_SUCCESS',
                form
            });
        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message
            });
        }
    }

    async destroy(req, res) {
        try {
            if (!req.params.id) {
                throw {
                    code: 400,
                    message: 'REQUIRED_FROM_ID'
                }
            }
    
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                throw {
                    code: 400,
                    message: 'INVALID_ID'
                }
            }
    
            const form = await FormModel.findOneAndDelete(
                {
                    _id: req.params.id,
                    userId: req.jwt.id
                },
            );
    
            if (!form) {
                throw {
                    code: 400,
                    message: 'FORM_DELETE_FAILED'
                };
            }
    
            return res.status(200).json({
                status: true,
                message: 'FORM_DELETE_SUCCESS',
                form
            });
        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message
            });
        }
    }
    
}

export default new FormController();
