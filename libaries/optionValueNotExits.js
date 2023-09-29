//membutuhkan data dari form dan answers
const optionValueNotExits = async (form, answers) => {

    // melakukan penegcekan dengan filter 
    const found = form.questions.filter((question) => {
        if(question.type == 'Radio' || question.type == 'Checkbox' || question.type == 'Dropdown'){
            //mecari pertanyaan dari user dan mencocok questionId dan answerId
            const answer = answer.find((answer) => answer.questionId == question.id)
            console.log(answer)
            // if(answer){
            //     const option = question.options.find((option) => option.value == answer.value)
            //     if(option == undefined){
            //         return true
            //     }
            // }
        }
    })

    // return found.length > 0 ? true : false
    return true
}

export default optionValueNotExits