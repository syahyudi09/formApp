import mongoose from "mongoose";
import FormController from "./FormController.js";
import AnswerModel from "../model/AnswerModel.js";
import answerDuplicate from "../libaries/AnswerDuplicate.js";
import questionRequiredButEmpty from "../libaries/QuestionRequired.js";
import FormModel from "../model/FormModel.js";
import optionValueNotExits from "../libaries/optionValueNotExits.js";

class AnswerController {

    async store(req, res){
        try {
            if(!req.params.formId) {
                throw{
                    code: 400,
                    message: 'REQUIRED FORM ID'
                }
            }
            if(!mongoose.Types.ObjectId.isValid(req.params.formId)) {
                throw{
                    code: 400,
                    message: 'INVALID FORM ID'
                }
            }

            const form = await FormModel.findById(req.params.formId)

            const isDuplicate = await answerDuplicate(req.body.answers)
            if(isDuplicate) {
                throw{
                    code: 400,
                    message: 'DUPLICATE_ANSWER'
                }
            }

            const optionValue = await optionValueNotExits(form, req.body.answers)
            if(!optionValue) {
                throw{
                    code: 400,
                    message: 'OPTION_VALUE_NOT_EXITS'
            }
            }

            const questionRequired = await questionRequiredButEmpty(form, req.body.answers)
            if(!questionRequired) {
                throw{
                    code: 400,
                    message: 'QUESTION_REQUIRED_BUT_EMPTY'
                }
            }
    
            let fields = {}
            req.body.answers.forEach((answer) => {
                fields[answer.questionId] = answer.value
            })
    
            const newAnswer = new AnswerModel({
                userId: req.jwt.id,  
                formId: req.params.formId,
                ...fields
            })
            const saveAnswer = await newAnswer.save();
            if(!saveAnswer) {
                throw{
                    code: 400,
                    message: 'ANSWER FAILED'
                }
            }
            return res.status(200).json({
                status: true,
                message: 'ANSWER SUCCESS',
                saveAnswer
            })
            
        } catch (error) {
            return res.status(error.code || 500)
                .json({
                    status:false,
                    message: error.message
                })
        }
    }

}

export default new AnswerController()