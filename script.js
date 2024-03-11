let isQuestionPending = false;

async function getQuestions() {
    try {
        const response = await fetch('questions.csv');
        const data = await response.text();
        // Specify that the CSV data has headers
        const parsedData = d3.csvParse(data, d3.autoType);
        return parsedData;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Function to get a random question
async function getRandomQuestion() {
    if (isQuestionPending) {
        // If a question is still pending, do not fetch a new one
        return null;
    }

    try {
        isQuestionPending = true;
        const questions = await getQuestions();
        console.log("All questions:", questions);
        
        const randomIndex = Math.floor(Math.random() * questions.length);
        const randomQuestion = questions[randomIndex];
        console.log("Random question:", randomQuestion);

        return randomQuestion;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        isQuestionPending = false;
    }
}

// Function to check the answer
function checkAnswer() {
    const userAnswer = document.getElementById("answer-input").value.toLowerCase();
    getRandomQuestion().then((currentQuestion) => {
        if (currentQuestion === null) {
            // A question is still pending, do not check the answer
            return;
        }

        if (userAnswer === currentQuestion.answer.toLowerCase()) {
            document.getElementById("result").innerText = "Correct!";
        } else {
            document.getElementById("result").innerText = `Wrong! The correct answer is: "${currentQuestion.answer}"`;
        }
    });
}

// Function to change the question
function changeQuestion() {
    getRandomQuestion().then((newQuestion) => {
        if (newQuestion === null) {
            // A question is still pending, do not change the question
            return;
        }

        document.getElementById("question").innerText = newQuestion.question;
        document.getElementById("answer-input").value = ""; // Clear the answer input
        document.getElementById("result").innerText = ""; // Clear the result
    });
}
