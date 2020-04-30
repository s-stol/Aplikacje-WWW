var validateForm = function () {
    var sbmt = document.querySelector("input[type=submit]");
    var impts = document.querySelectorAll("input, select");
    var alright = true;
    impts.forEach(function (item) {
        var itemValue = item.value;
        if (itemValue == "") {
            alright = false;
        }
    });
    if (alright) {
        var dateInput = document.querySelector("input[type=date");
        var dateValue = dateInput.valueAsDate;
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        dateValue.setHours(0, 0, 0, 0);
        if (dateValue < today) {
            alright = false;
        }
    }
    if (alright) {
        sbmt.style.display = "";
    }
    else {
        sbmt.style.display = "none";
    }
};
validateForm();
var okno = document.querySelector("div[id=okienko]");
okno.style.display = "none";
var impts = document.querySelectorAll("input, select");
impts.forEach(function (item) {
    var itemVal = item;
    itemVal.addEventListener("input", function () { validateForm(); }, true);
});
var form = document.querySelector("form");
form.addEventListener("reset", function () {
    setTimeout(function () {
        var sbmt = document.querySelector("input[type=submit]");
        sbmt.style.display = "none";
        validateForm();
    }, 0);
}, true);
var submitForm = function () {
    var okno = document.querySelector("div[id=okienko]");
    okno.style.display = "";
    /* Imię */
    var inputVal = document.querySelector("input[id=fname]");
    var parVal = document.querySelector("[id=oknoImie]");
    var strBegin = "Imię: ";
    parVal.textContent = strBegin.concat(inputVal.value);
    /* Nazwisko */
    inputVal = document.querySelector("input[id=lname]");
    parVal = document.querySelector("[id=oknoNazwisko]");
    strBegin = "Nazwisko: ";
    parVal.textContent = strBegin.concat(inputVal.value);
    /* Skąd */
    inputVal = document.querySelector("select[id=skad]");
    parVal = document.querySelector("[id=oknoSkad]");
    strBegin = "Skąd: ";
    parVal.textContent = strBegin.concat(inputVal.value);
    /* Dokąd */
    inputVal = document.querySelector("select[id=dokad]");
    parVal = document.querySelector("[id=oknoDokad]");
    strBegin = "Dokąd: ";
    parVal.textContent = strBegin.concat(inputVal.value);
    /* Data */
    inputVal = document.querySelector("input[id=data]");
    parVal = document.querySelector("[id=oknoData]");
    strBegin = "Data: ";
    parVal.textContent = strBegin.concat(inputVal.value);
};
form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitForm();
}, true);
var returnButton = document.querySelector("[id=powrot]");
returnButton.addEventListener("click", function () {
    var okno = document.querySelector("div[id=okienko]");
    okno.style.display = "none";
}, true);
