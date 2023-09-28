const questionRequiredButEmpty = async (form, answers)=> {
    const found = form.questions.filter((question) => {
        if(question.required === true){
            const answer = answers.find((answer)=> answer.questionId == question.id  )
            if(answer == undefined || answer.value || answer.value == ''){
                return true
            }
        }
    })

    return found.length > 0 ? found[0].question : false
}

export default questionRequiredButEmpty