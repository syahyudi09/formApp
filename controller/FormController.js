import mongoose from "mongoose";
import FormModel from "../model/FormModel.js";

class FormController {
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
}

export default new FormController();
