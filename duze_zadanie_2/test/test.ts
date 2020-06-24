import {Builder, Capabilities} from 'selenium-webdriver';
import { expect } from 'chai';
import { driver } from 'mocha-webdriver';

const login = async (login: string, password: string) => {
    await driver.find("a[id=login]").doClick();
    await driver.find("input[name=user]").sendKeys(login);
    await driver.find("input[name=pass]").sendKeys(password);
    await driver.find("input[type=submit]").doClick();
}

const changePass = async (oldPass: string, newPass: string) => {
    await driver.find("a[id=changepass]").doClick();
    await driver.find("input[name=pass]").sendKeys(oldPass);
    await driver.find("input[name=newPass]").sendKeys(newPass);
    await driver.find("input[type=submit]").doClick();
}

const startQuiz = async (id: string) => {
    await driver.find("select").sendKeys(id);
    await driver.find("input[type=submit]").doClick();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
    

const doQuiz = async (answers: Number[], waitTimes: Number[]) => {
    for (let i = 0; i < answers.length; i++) {
        if (i > 0) {
            await driver.find("button[id=next]").doClick();
        }
        await sleep(waitTimes[i]);
        await driver.find("input[id=odp]").sendKeys(String(answers[i]));
    }
    await driver.find("button[id=stop]").doClick();
}


describe("tests", () => {

    it ("should return correct data from the server", async function() {
        this.timeout(20000);
        await driver.get(`http://localhost:3000`);
        await login("test", "test");
        await startQuiz("1");
        await doQuiz([4, 147, 123, 456], [500, 1000, 1500, 2000]);
        expect(parseInt((await driver.find("[id=result]").getText()), 10)).to.be.above(23); // 5s + 20p
        expect(parseInt((await driver.find("[id=result]").getText()), 10)).to.be.below(27); // 5s + 20p
        expect((await driver.find("[id=stats]").getText()).split(" ").map((n) => {return parseInt(n, 10)})[0]).to.be.above(7);
        expect((await driver.find("[id=stats]").getText()).split(" ").map((n) => {return parseInt(n, 10)})[0]).to.be.below(13);
        expect((await driver.find("[id=stats]").getText()).split(" ").map((n) => {return parseInt(n, 10)})[1]).to.be.above(17);
        expect((await driver.find("[id=stats]").getText()).split(" ").map((n) => {return parseInt(n, 10)})[1]).to.be.below(23);
        expect((await driver.find("[id=stats]").getText()).split(" ").map((n) => {return parseInt(n, 10)})[2]).to.be.above(27);
        expect((await driver.find("[id=stats]").getText()).split(" ").map((n) => {return parseInt(n, 10)})[2]).to.be.below(33);
        expect((await driver.find("[id=stats]").getText()).split(" ").map((n) => {return parseInt(n, 10)})[3]).to.be.above(37);
        expect((await driver.find("[id=stats]").getText()).split(" ").map((n) => {return parseInt(n, 10)})[3]).to.be.below(43);
        await driver.find("a").doClick();
        await driver.find("a[id=logout]").doClick();
    });

    it ("should not let the user do the same test twice", async function() {
        this.timeout(20000);
        await driver.get(`http://localhost:3000`);
        await login("test", "test");
        await startQuiz("2");
        await doQuiz([1, 17, 1234, 4567, 345], [500, 500, 500, 500, 500]);
        await driver.find("a").doClick();
        await startQuiz("2");
        expect((await driver.find("h1").getText())).to.contain("Błąd");
        await driver.find("a").doClick();
        await driver.find("a[id=logout]").doClick();
    });

    it ("should logout all the sessions after changing password", async function() {
        this.timeout(20000);
        await driver.get(`http://localhost:3000`);
        await login("test", "test");
        await driver.manage().getCookies().then(async function(cookies) {
            await driver.manage().deleteAllCookies();
            await driver.navigate().refresh();
            await login("test", "test");
            await changePass("test", "test");
            for (let i = 0; i < cookies.length; i++) {
                delete cookies[i].domain;
                await driver.manage().addCookie(cookies[i]);
            }
            await driver.navigate().refresh();
            expect(await driver.find("a[id=login]").isDisplayed()).equals(true);
            expect(await driver.find("a[id=logout]").isDisplayed()).equals(false);
        });
    });
});
