let validateForm = function () {
    let sbmt = document.querySelector("input[type=submit]") as HTMLInputElement;
    let impts = document.querySelectorAll("input, select");
    let alright = true;
    impts.forEach(
        function(item) {
            let itemValue = (<HTMLInputElement>item).value;
            if (itemValue == "") {
                alright = false;
            }
        }
    )
    if (alright) {
        let dateInput = document.querySelector("input[type=date") as HTMLInputElement;
        let dateValue = dateInput.valueAsDate;
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        dateValue.setHours(0, 0, 0, 0);
        if (dateValue < today) {
            alright = false;
        }
    }
    if (alright) {
        sbmt.style.display = "";
    } else {
        sbmt.style.display = "none";
    }
}
validateForm();
let okno = document.querySelector("div[id=okienko]") as HTMLDivElement;
okno.style.display = "none";

let impts = document.querySelectorAll("input, select");

impts.forEach(
    function(item) {
        let itemVal = <HTMLInputElement>item
        itemVal.addEventListener("input", function(){validateForm()}, true);
    }
)

let form = document.querySelector("form") as HTMLFormElement;
form.addEventListener("reset", function() {
    setTimeout(() => {
        let sbmt = document.querySelector("input[type=submit]") as HTMLInputElement;
        sbmt.style.display = "none"; validateForm()
    }, 0);
}, true);

let submitForm = function () {
    let okno = document.querySelector("div[id=okienko]") as HTMLDivElement;
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

form.addEventListener("submit", function(e){
    e.preventDefault();
    submitForm();
}, true);

let returnButton = document.querySelector("[id=powrot]");

returnButton.addEventListener("click", function(){
    let okno = document.querySelector("div[id=okienko]") as HTMLDivElement;
    okno.style.display = "none";
}, true);