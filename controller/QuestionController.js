import mongoose, { set } from "mongoose";
import FormModel from "../model/FormModel.js";

const allowanceType = [
    'Text',
    'Radio',
    'Checkbox',
    'Dropdown'
]

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
                    message: 'QUESTION_UPDATE_FAILED'
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

    async update(req, res){
        try {
            if(!req.params.id){
                throw{
                    code: 400,
                    message: 'REQUIRED_FROM_ID'
                }
            }
            if(!req.params.questionId){
                throw{
                    code: 400,
                    message: 'REQUIRED_QUESTION_ID'
                }
            }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)){
                throw{
                    code: 400,
                    message: 'INVALID_ID'
                }
            }
            if(!mongoose.Types.ObjectId.isValid(req.params.questionId)){
                throw{
                    code: 400,
                    message: 'INVALID_ID'
                }
            }

            let field = {}
            if(req.body.hasOwnProperty('question')){
                field['questions.$[indexQuestion].question'] = req.body.question
            }else if(req.body.hasOwnProperty('required')){
                field['questions.$[indexQuestion].required'] = req.body.required
            }else if(req.body.hasOwnProperty('type')){
                if(!allowanceType.includes(req.body.type)){
                    throw{
                        code: 400,
                        message: 'INVALID_QUESTION_TYPE'
                    }
                }
                field['questions.$[indexQuestion].type'] = req.body.type
            }

            const form = await FormModel.findOneAndUpdate(
                {
                    _id: req.params.id, // cek id form
                    userId: req.jwt.id // cek id login
                },
                {
                    $set: field
                },
                {
                    arrayFilters: [
                        {
                            'indexQuestion.id': new mongoose.Types.ObjectId(req.params.questionId)
                        }
                    ],
                    new: true
                }
            )
            
            if(!form){
                throw{
                    code: 400,
                    message: 'QUESTION_UPDATE_FAILED'
                }
            }
            return res.status(200).json({
                status: true,
                message: 'QUESTION_UPDATE_SUCCESS'
            })
        } catch (error) {
            console.log(error)
            return res.status(error.code || 500).json({
                status: false,
                message: error.message
            });
        }
    }

    async destroy(req, res){
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
            const form = await FormModel.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId: req.jwt.id
                },
                {
                    $pull: {
                        questions:{
                            id: new mongoose.Types.ObjectId(req.params.questionId)
                        }
                    }
                },
                {
                    new:true
                }
            )

            if(!form){
                throw{
                    code:400,
                    message: 'DELETE_QUESTION_FAILED'
                }
            }

            return res.status(200).json(
                {
                    status: true,
                    message: 'DELETE_QUESTION_SUCCESS',
                    form
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