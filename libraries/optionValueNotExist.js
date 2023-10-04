//is option.value exist in options
const optionValueNotExist = async (forms, answers) => {
    const questions = forms.questions

    const found = questions.filter(question => {
        //just check if question type is checkbox, radio or dropdown
        if(question.type == "Radio" || question.type == "Dropdown") {
            //find answer by questionId
            const answer = answers.find((answer) => answer.questionId == question.id)
            console.log(answer)
            if(answer) { 
                //find option by value
                const option = question.options.find((option) => option.value == answer.value)
                if(option === undefined) {
                    return true
                }
            }
        } else if(question.type === 'Checkbox') {
            const answer = answers.find((answer) => answer.questionId == question.id)
            if(answer) {
                //find option by value
                return answer.value.some(value => {
                    console.log(value)
                    const option = question.options.find((option) => option.value == value)
                    console.log(option)
                    if(option === undefined) {
                        return true
                    }
                });
            }
        }
    })
    return found.length > 0 ? true : false
}

export default optionValueNotExist;