let validateForm = () => {
    const sbmt = document.querySelector("input[type=submit]") as HTMLInputElement;
    const impts = document.querySelectorAll("input, select");
    let alright = true;
    impts.forEach(
        (item) => {
            const itemValue = (item as HTMLInputElement).value;
            if (itemValue === "" || / .*/.test(itemValue)) { // string is empty or begins with a space
                alright = false;
            }
        }
    )
    if (alright) {
        const dateInput = document.querySelector("input[type=date]") as HTMLInputElement;
        const dateValue = dateInput.valueAsDate;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dateValue.setHours(0, 0, 0, 0);
        if (dateValue < today) {
            alright = false;
        }
    }
    if (alright) {
        sbmt.disabled = false;
    } else {
        sbmt.disabled = true;
    }
}
validateForm();
let okno = document.querySelector("div[id=okienko]") as HTMLDivElement;
okno.style.display = "none";

let form = document.querySelector("form") as HTMLFormElement;

form.addEventListener("input", () => {validateForm()}, true);

form.addEventListener("reset", () => {
    const sbmt = document.querySelector("input[type=submit]") as HTMLInputElement;
    sbmt.disabled = true;
}, true);

let submitForm = (e) => {
    e.preventDefault();
    okno.style.display = "";

    /* Imię */
    let inputVal = document.querySelector("input[id=fname]") as HTMLInputElement;
    let parVal = document.querySelector("[id=oknoImie]") as HTMLParagraphElement;
    let strBegin = "Imię: "
    parVal.textContent = strBegin.concat(inputVal.value);

    /* Nazwisko */
    inputVal = document.querySelector("input[id=lname]") as HTMLInputElement;
    parVal = document.querySelector("[id=oknoNazwisko]") as HTMLParagraphElement;
    strBegin = "Nazwisko: "
    parVal.textContent = strBegin.concat(inputVal.value);

    /* Skąd */
    inputVal = document.querySelector("select[id=skad]") as HTMLInputElement;
    parVal = document.querySelector("[id=oknoSkad]") as HTMLParagraphElement;
    strBegin = "Skąd: "
    parVal.textContent = strBegin.concat(inputVal.value);

    /* Dokąd */
    inputVal = document.querySelector("select[id=dokad]") as HTMLInputElement;
    parVal = document.querySelector("[id=oknoDokad]") as HTMLParagraphElement;
    strBegin = "Dokąd: "
    parVal.textContent = strBegin.concat(inputVal.value);

    /* Data */
    inputVal = document.querySelector("input[id=data]") as HTMLInputElement;
    parVal = document.querySelector("[id=oknoData]") as HTMLParagraphElement;
    strBegin = "Data: "
    parVal.textContent = strBegin.concat(inputVal.value);
}

form.addEventListener("submit", (e) => {
    submitForm(e);
}, true);

let returnButton = document.querySelector("[id=powrot]");

returnButton.addEventListener("click", () => {
    okno.style.display = "none";
}, true);