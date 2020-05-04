function compareNumbers(a: number, b: number) {
    return a - b;
}

function displayHighScores() {
    const resJSON = localStorage.getItem("results");
    if (resJSON === null) {
        const bestRes = document.querySelector("div[id=bestResults]") as HTMLDivElement;
        bestRes.style.display = "none";
    } else {
        const results = JSON.parse(resJSON) as number[];
        const table = document.querySelector("ol");
        results.sort(compareNumbers);
        const resultsShowed = Math.min(results.length, 5);
        for (let i = 0; i < resultsShowed; i++) {
            const li = document.createElement("li");
            li.textContent = results[i].toString();
            table.appendChild(li);
        }
    }
}

displayHighScores();

const startButton = document.querySelector("button[id=start]") as HTMLButtonElement;

startButton.addEventListener("click", () => {
    window.location.replace("quizSolve.html");
}, true);