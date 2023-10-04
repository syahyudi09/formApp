import mongoose from "mongoose";
import Form from "../model/FormModel.js";
import Answer from "../model/AnswerModel.js";
import User from "../model/UserModel.js";
import questionRequiredButEmpty from "../libraries/questionRequiredButEmpty.js";
import questionIdNotValid from "../libraries/questionIdNotValid.js";
import answerDuplicate from "../libraries/answerDuplicate.js";
import optionValueNotExist from "../libraries/optionValueNotExist.js";
// import emailNotValid from "../libraries/emailNotValid.js";

class AnswerController {
    async store(req, res) {
        //simpan sebuah task baru
        try {
            if(!mongoose.Types.ObjectId.isValid(req.params.formId)) { throw { code: 400, message: "INVALID_ID" } }

            const forms = await Form.findById(req.params.formId)
            if(!forms) { throw { code: 404, message: "FORM_NOT_FOUND" } }

            const isDuplicate = await answerDuplicate(req.body.answers)
            if(isDuplicate) { throw { code: 400, message: "ANSWER_DUPLICATED" } }

            const questionNotValid = await questionIdNotValid(forms, req.body.answers)
            if(questionNotValid) { throw { code: 400, message: "QUESTION_NOT_FOUND" } }

            const questionRequiredEmpty = await questionRequiredButEmpty(forms, req.body.answers)
            if(questionRequiredEmpty) { throw { code: 428, question: questionRequiredEmpty, message: "QUESTION_REQUIRED" } }

            const optionNotExist = await optionValueNotExist(forms, req.body.answers)
            if(optionNotExist) { throw { code: 400, question: optionNotExist, message: "OPTION_VALUE_IS_NOT_EXIST" } }
            
            // const emailNotValidExist = await emailNotValid(forms, req.body.answers)
            // if(emailNotValidExist) { throw { code: 400, question: emailNotValidExist, message: "EMAIL_IS_NOT_VALID" } }

            let fields = {};
            req.body.answers.forEach((answer) => {
                fields[answer.questionId] = answer.value
            })

            //create answers
            const newAnswer = new Answer({
                userId: req.JWT.id,
                formId: req.params.formId,
                ...fields
            });
            const answer = await newAnswer.save();
            if(!answer) { throw { code: 500, message: "FAILED_ANSWER" } }

            res.status(200).json({
                status: true,
                message: "SUCCESS_ANSWER",
                answer
            })
        } catch (err) {
            let returnError = {
                status: false,
                message: err.message,
            }

            if(err.question) {
                returnError.question = err.question
            }

            res.status(err.code || 500)
                .json(returnError)
        }
    }
}

export default new AnswerController();