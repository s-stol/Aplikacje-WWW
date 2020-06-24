let currQuestion: number;
let numOfQuestions: number;
let answers: string[]; // answers given by the user
let times: number[];   // times spent answering the questions (in miliseconds)
let lastTimeIncrement: Date;
let timeTotal: number;

let finalResult: number;
let finalTimes: number[];

const quiz = {
    "intro":document.currentScript.getAttribute("intro"),
    "questions":JSON.parse(document.currentScript.getAttribute("questions"))
}

const csrfToken = document.currentScript.getAttribute('csrfToken');
const quizId = document.currentScript.getAttribute('quizId');

function displayQuestion() { // displays question no. currQuestion
    const question = quiz.questions[currQuestion];
    const que = document.querySelector("label");
    const ans = document.querySelector("input");
    que.textContent = question.question;
    ans.value = answers[currQuestion];

    const queNum = document.querySelector("p[id=numQuestion]");
    queNum.textContent = String(currQuestion+1);

    const pen = document.querySelector("p[id=penalty]");
    pen.textContent = String(question.penalty);

    const prev = document.querySelector("button[id=prev]") as HTMLButtonElement;
    const next = document.querySelector("button[id=next]") as HTMLButtonElement;
    prev.style.visibility = "";
    next.style.visibility = "";

    if (currQuestion === 0) {
        prev.style.visibility = "hidden";
    }
    if (currQuestion === numOfQuestions - 1) {
        next.style.visibility = "hidden";
    }
}

function init() {
    currQuestion = 0;
    numOfQuestions = quiz.questions.length;

    const intro = document.querySelector("p[id=intro]");
    intro.textContent = quiz.intro;

    answers = new Array(numOfQuestions);
    for (let i = 0; i < numOfQuestions; i++) {
        answers[i]="";
    }

    times = new Array(numOfQuestions);
    for (let i = 0; i < numOfQuestions; i++) {
        times[i] = 0;
    }
    timeTotal = 0;
    lastTimeIncrement = new Date();

    displayQuestion();
    checkAnswers();
}

init();

function incrementTime() { // increments the time of current question and total time
    const newTimeIncrement = new Date();
    const incrValue = newTimeIncrement.getTime() - lastTimeIncrement.getTime();
    times[currQuestion] += incrValue;
    timeTotal += incrValue;
    lastTimeIncrement = newTimeIncrement;

    const timePassed = document.querySelector("p[id=timePassed]");
    const timeSecs = Math.floor(timeTotal / 1000);
    timePassed.textContent = timeSecs.toString();
}

function doIncrementTime() {
    incrementTime();
    setTimeout(doIncrementTime, 50);
}

doIncrementTime();

let prevButton = document.querySelector("button[id=prev]") as HTMLButtonElement;
let nextButton = document.querySelector("button[id=next]") as HTMLButtonElement;

prevButton.addEventListener("click", () => {
    incrementTime();
    currQuestion--;
    displayQuestion();
}, true);

nextButton.addEventListener("click", () => {
    incrementTime();
    currQuestion++;
    displayQuestion();
}, true);

let inputField = document.querySelector("input");

function isNumeric(s: string) {
    if (/^-0\d*$/.test(s) || /^0\d+$/.test(s)) {
        return false;
    }
    return /^-{0,1}\d+$/.test(s);
}

function checkAnswers() { // checks if all the inputs are integers, if so displays the stop button
    let isCorrect = true;
    for (let i = 0; i < numOfQuestions; i++) {
        if (!isNumeric(answers[i])) {
            isCorrect = false;
        }
    }

    const stop = document.querySelector("button[id=stop]") as HTMLButtonElement;
    if (isCorrect) {
        stop.disabled = false;
    } else {
        stop.disabled = true;
    }
}

inputField.addEventListener("input", () => {
    answers[currQuestion] = inputField.value;
    checkAnswers();
}, true);

let returnButton = document.querySelector("button[id=return]") as HTMLButtonElement;

returnButton.addEventListener("click", () => {
    window.location.replace("/");
}, true);

let stopButton = document.querySelector("button[id=stop]") as HTMLButtonElement;

stopButton.addEventListener("click", () => { // stops the quiz, displays final statistics
    incrementTime();
    const timeFinal = timeTotal;
    finalTimes = new Array(numOfQuestions);
    for (let i = 0; i < numOfQuestions; i++) {
        finalTimes[i] = times[i];
    }

    const timePercentages = [];

    for (let i = 0; i < numOfQuestions; i++) {
        timePercentages.push(finalTimes[i]/timeFinal);
    }

    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/quizSolved';

    const params = {'_csrf': csrfToken, 'finalTimes': JSON.stringify(timePercentages), 'finalAnswers': JSON.stringify(answers), 'quizId':quizId};
  
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = params[key];
        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
}, true);