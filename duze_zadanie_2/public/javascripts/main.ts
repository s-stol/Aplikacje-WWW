if (document.currentScript.getAttribute("isLoggedIn")) {
    const login = document.querySelector("a[id=login]") as HTMLDivElement;
    login.style.display = "none";
} else {
    const stats = document.querySelector("a[id=stats]") as HTMLDivElement;
    stats.style.display = "none";
    const logout = document.querySelector("a[id=logout]") as HTMLDivElement;
    logout.style.display = "none";
    const changePass = document.querySelector("a[id=changepass]") as HTMLDivElement;
    changePass.style.display = "none";
    const form = document.querySelector("form") as HTMLFormElement;
    form.style.display = "none";
}