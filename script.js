let isQuestionPending = false;
let currentQuestion; // Store the current question

async function fetchQuestions() {
    try {
        const response = await fetch('questions.csv');
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
        const questions = await fetchQuestions();
        console.log("All questions:", questions);

        const randomIndex = Math.floor(Math.random() * questions.length);
        currentQuestion = questions[randomIndex]; // Save the current question
        console.log("Random question:", currentQuestion);

        return currentQuestion;
    } catch (error) {
        console.error("Error getting random question:", error);
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

document.addEventListener('DOMContentLoaded', function() {
    changeQuestion();
});