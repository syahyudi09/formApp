const answerDuplicate = async (answers) => {
    const seen = new Set();
    for (const answer of answers) {
        if (seen.has(answer.questionId)) {
            return true; // Ada duplikat, mengembalikan true
        }
        seen.add(answer.questionId);
    }
    console.log(answers)
    // Jika sampai ke sini, berarti tidak ada duplikat, maka mengembalikan false
    return false;
}

export default answerDuplicate
