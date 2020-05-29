function compareNumbers(a: number, b: number) {
    return a - b;
}

const dbName = "quizdb";
let db: IDBDatabase;
const request = indexedDB.open(dbName);

request.onupgradeneeded = (event) => {
    request.result.createObjectStore("res", { autoIncrement : true });
    request.result.createObjectStore("stat", { autoIncrement : true });
};

request.onsuccess = (event) => {
    db = (event.target as IDBOpenDBRequest).result;
    displayHighScores(db);
};

request.onerror = () => {
    const bestRes = document.querySelector("div[id=bestResults]") as HTMLDivElement;
    bestRes.style.display = "none";
}

function displayHighScores(dataBase: IDBDatabase) {
    const transaction = dataBase.transaction(["res"]);
    const objectStore = transaction.objectStore("res");
    const req = objectStore.getAll();
    req.onsuccess = (event) => {
        const results = req.result;
        if (results.length === 0) {
            const bestRes = document.querySelector("div[id=bestResults]") as HTMLDivElement;
            bestRes.style.display = "none";
        }
        const table = document.querySelector("ol");
        results.sort(compareNumbers);
        const resultsShowed = Math.min(results.length, 5);
        for (let i = 0; i < resultsShowed; i++) {
            const li = document.createElement("li");
            li.textContent = results[i].toString();
            table.appendChild(li);
        }
    }
    req.onerror = (event) => {
        const bestRes = document.querySelector("div[id=bestResults]") as HTMLDivElement;
        bestRes.style.display = "none";
    }
}

const startButton = document.querySelector("button[id=start]") as HTMLButtonElement;

startButton.addEventListener("click", () => {
    window.location.replace("quizSolve.html");
}, true);