let currQuestion: number;
let numOfQuestions: number;
let answers: string[]; // answers given by the user
let times: number[];   // times spent answering the questions (in miliseconds)
let lastTimeIncrement: Date;
let timeTotal: number;

let finalResult: number;
let finalTimes: number[];

const dbName = "quizdb";
let db: IDBDatabase;
const request = indexedDB.open(dbName);

request.onupgradeneeded = (event) => {
    request.result.createObjectStore("res", { autoIncrement : true });
    request.result.createObjectStore("stat", { autoIncrement : true });
};

let noStatsButton = document.querySelector("button[id=exitNoStats]") as HTMLButtonElement;
let statsButton = document.querySelector("button[id=exitStats]") as HTMLButtonElement;

request.onsuccess = (event) => {
    db = (event.target as IDBOpenDBRequest).result

    noStatsButton.addEventListener("click", () => {
        const transaction = db.transaction(["res"], "readwrite");
        const store = transaction.objectStore("res");
        const req = store.add(finalResult);
        transaction.oncomplete = () => {
            window.location.href = "quiz.html";
        }
    }, true);

    statsButton.addEventListener("click", () => {
        const transaction = db.transaction(["res", "stat"], "readwrite");
        const storeRes = transaction.objectStore("res");
        const storeStat = transaction.objectStore("stat");
        const reqR = storeRes.add(finalResult);
        const reqS = storeStat.add(finalTimes);
        transaction.oncomplete = () => {
            window.location.href = "quiz.html";
        }
    }, true);
};

request.onerror = (event) => { // the storage won't get upgraded
    noStatsButton.addEventListener("click", () => {
        window.location.href = "quiz.html";
    }, true);

    statsButton.addEventListener("click", () => {
        window.location.href = "quiz.html";
    }, true);
}

const quiz = {
    "intro":"Oto przykładowy quiz",
    "questions":[
                    {"question":"2 + 2 =","answer":4, "penalty":3},
                    {"question":"(4 + 17) x (11 - 4) =","answer":147, "penalty":5},
                    {"question":"(2 x 3 + 14) x (54 - 13) =","answer":820, "penalty":10},
                    {"question":"(13 x 3 + 7) x (4 + 2) =","answer":276, "penalty":10}
                ]
}

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

    const endQuiz = document.querySelector("div[id=endOfQuiz]") as HTMLDivElement;
    endQuiz.style.display = "none";
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
    window.location.replace("quiz.html");
}, true);

let stopButton = document.querySelector("button[id=stop]") as HTMLButtonElement;

stopButton.addEventListener("click", () => { // stops the quiz, displays final statistics
    incrementTime();
    const timeFinal = timeTotal;
    finalTimes = new Array(numOfQuestions);
    for (let i = 0; i < numOfQuestions; i++) {
        finalTimes[i] = times[i];
    }

    const endQuiz = document.querySelector("div[id=endOfQuiz]") as HTMLDivElement;
    endQuiz.style.display = "";

    const correctAnswers = document.querySelector("p[id=correctAnswers]");
    const wrongAnswers = document.querySelector("p[id=wrongAnswers]");
    const penalty = document.querySelector("p[id=penaltyTotal]");
    const time = document.querySelector("p[id=time]");
    const result = document.querySelector("p[id=result]");

    let penaltyTotal = 0;
    let corrAns = "Poprawne odpowiedzi:"
    let wrongAns = "Błędne odpowiedzi:"
    let pen = "Kara za błędne odpowiedzi: "
    for (let i = 0; i < numOfQuestions; i++) {
        if (parseInt(answers[i], 10) === quiz.questions[i].answer) {
            corrAns = corrAns.concat(" ");
            corrAns = corrAns.concat((i+1).toString());
        } else {
            wrongAns = wrongAns.concat(" ");
            wrongAns = wrongAns.concat((i+1).toString());
            penaltyTotal += quiz.questions[i].penalty;
        }
    }
    pen = pen.concat(penaltyTotal.toString())
    const timeSecs = Math.floor(timeFinal / 1000);
    finalResult = timeSecs + penaltyTotal;

    correctAnswers.textContent = corrAns;
    wrongAnswers.textContent = wrongAns;
    penalty.textContent = pen;
    time.textContent = "Czas: ".concat(timeSecs.toString());
    result.textContent = "Ostateczny wynik: ".concat(finalResult.toString());
}, true);