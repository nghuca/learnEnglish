async function getQuestions() {
    try {
        const response = await fetch('questions.csv');
        const data = await response.text();
        const parsedData = d3.csvParse(data);
        return parsedData;
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error or return an indication of failure
    }
}


// Function to get a random question
async function getRandomQuestion() {
    const questions = await getQuestions();
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

// Function to check the answer
function checkAnswer() {
    const userAnswer = document.getElementById("answer-input").value.toLowerCase();
    getRandomQuestion().then((currentQuestion) => {
        if (userAnswer === currentQuestion.answer.toLowerCase()) {
            document.getElementById("result").innerText = "Correct!";
        } else {
            document.getElementById("result").innerText = `Wrong! The correct answer is: "${currentQuestion.answer}"`;
        }
    });
}

// Display initial question
getRandomQuestion().then((initialQuestion) => {
    document.getElementById("question").innerText = initialQuestion.question;
});