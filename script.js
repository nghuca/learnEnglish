let isQuestionPending = false;
let currentQuestion;
async function fetchQuestions_answers() {
    try {
        const response = await fetch('questions_answers.csv');
        const data = await response.text();
        return d3.csvParse(data, d3.autoType);
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
}

async function getRandomQuestion() {
    if (isQuestionPending) {
        return null;
    }

    try {
        isQuestionPending = true;
        const questions = await fetchQuestions_answers();

        const randomIndex = Math.floor(Math.random() * questions.length);
        currentQuestion = questions[randomIndex]; // Save the current question
        // console.log("Random question:", currentQuestion);

        return currentQuestion;
    } catch (error) {
        //  .error("Error getting random question:", error);
        throw error;
    } finally {
        isQuestionPending = false;
    }
}

function setResult(text) {
    document.getElementById("result").innerText = text;
}

function changeQuestion() {
    getRandomQuestion().then((newQuestion) => {
        if (!newQuestion) {
            return;
        }

        document.getElementById("question").innerText = newQuestion.question;
        document.getElementById("answer-input").value = "";
        document.getElementById("result").innerText = "";
    });
}

async function checkAnswer() {
    const userAnswer = document.getElementById("answer-input").value.toLowerCase();
    
    if (!currentQuestion) {
        return;
    }

    const resultElement = document.getElementById("result");

    if (userAnswer === currentQuestion.answer.toLowerCase()) {
        changeQuestion();
        setResult("Correct!");
    } else {
        setResult(`Wrong! The correct answer is: "${currentQuestion.answer}"`);
    }
}

document.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        checkAnswer();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    changeQuestion();
});
