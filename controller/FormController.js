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
}

export default new FormController();
