import {Builder, Capabilities} from 'selenium-webdriver';
import { expect } from 'chai';
import { driver } from 'mocha-webdriver';

const fillText = async function() {
    await driver.find("input[id=fname]").sendKeys("Jan");
    await driver.find("input[id=lname]").sendKeys("Kowalski");
    await driver.find("select[id=skad]").sendKeys("Londyn");
    await driver.find("select[id=dokad]").sendKeys("Kapsztad");
}

const fillForm = async function() {
    await fillText();
    var currDay = new Date().toISOString().slice(0,10);
    await driver.find("input[id=data]").sendKeys(currDay); //TODO
}

const checkNotClickable = async function(selector: string) {
    expect(await driver.find(selector).click().then(() => true, () => false)).to.equal(false); 
}


describe("Form showing submission button", function() {

    it ("should not show the submit button immediately", async function() {
        this.timeout(20000);
        await driver.get('file://${process.cwd()}/plik.html');
        expect(await driver.find("input[type=submit]").isDisplayed()).equals(false);
    });

    it ("should show the button after filling", async function() {
        this.timeout(20000);
        await fillForm();
        expect(await driver.find("input[type=submit]").isDisplayed()).equals(true);
    });
 
    it ("should not show the button after reset", async function() {
        this.timeout(20000);
        await (await driver.find("input[type=reset]")).doClick();
        expect(await driver.find("input[type=submit]").isDisplayed()).equals(false);
    });
   
    it ("should not show the button with date before present day", async function() {
        this.timeout(20000);
        await fillText();
        await driver.find("input[id=data]").sendKeys("2017-08-22");  
        expect(await driver.find("input[type=submit]").isDisplayed()).equals(false);
        await (await driver.find("input[type=reset]")).doClick();
    });

});

describe("Submitting the form", function() {

    it ("should display a window after pressing the submit button", async function() {
        this.timeout(20000);
        await fillForm();
        await (await driver.find("input[type=submit]")).doClick();
        expect(await driver.find("[id=okienko").isDisplayed()).equals(true);
    });

    it ("should let the user return to the main page", async function() {
        this.timeout(20000);
        await (await driver.find("button[id=powrot]")).doClick();
        expect(await driver.find("[id=okienko").isDisplayed()).equals(false);
        await (await driver.find("input[type=reset]")).doClick();
    });

    it("should show correct data after making the input", async function() {
        this.timeout(20000);
        await fillForm();
        await driver.find("input[type=submit]").doClick();
        expect(await driver.find("[id=oknoImie]").getText()).to.include("Jan");
        expect(await driver.find("[id=oknoImie]").getText()).not.to.include("Kowalski");
        expect(await driver.find("[id=oknoNazwisko]").getText()).to.include("Kowalski");
        expect(await driver.find("[id=oknoSkad]").getText()).to.include("Londyn");
        expect(await driver.find("[id=oknoDokad]").getText()).to.include("Kapsztad");
        expect(await driver.find("[id=oknoData]").getText()).to.include(new Date().toISOString().slice(0,10));
    });

    it("should not let the user click any links while covered", async function() {
        this.timeout(20000);
        await checkNotClickable("a");
        await checkNotClickable("input[type=submit]");
        await checkNotClickable("input[type=reset]");
    });

    it("should let the user click links after returning", async function() {
        this.timeout(20000);
        await (await driver.find("button[id=powrot]")).doClick();
        expect(await driver.find("a").click().then(() => true, () => false)).to.equal(true); 
    });
});