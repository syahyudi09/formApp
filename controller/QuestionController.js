import mongoose from "mongoose";
import FormModel from "../model/FormModel.js";

class QuestionsController{
    async store(req, res){
        try {
            if(!req.params.id){
                throw{
                    code: 400,
                    message: 'REQUIRED_FROM_ID'
                }
            }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)){
                throw{
                    code: 400,
                    message: 'INVALID_ID'
                }
            }

            const newQuestion = {
                id: new mongoose.Types.ObjectId(),
                question: null,
                type: 'Text',
                required: false,
                option: []
            }

            const form = await FormModel.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId: req.jwt.id
                },
                {
                    $push:{
                        questions: newQuestion
                    }
                },
                {
                    new: true,
                }
            )
            if(!form){
                throw{
                    code:400,
                    message: 'FORM_UPDATE_FAILED'
                }
            }

            return res.status(200).json(
                {
                    status: true,
                    message: 'ADD_QUESTION_SUCCESS',
                    question: newQuestion
                }
            )
        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message
            });
        }
    }
}

export default new QuestionsController()