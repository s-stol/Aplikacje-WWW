"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _id, _name, _prices, _url;
Object.defineProperty(exports, "__esModule", { value: true });
class Meme {
    constructor(id, name, price, url) {
        _id.set(this, void 0);
        _name.set(this, void 0);
        _prices.set(this, void 0);
        _url.set(this, void 0);
        __classPrivateFieldSet(this, _id, id);
        __classPrivateFieldSet(this, _name, name);
        __classPrivateFieldSet(this, _prices, [price]);
        __classPrivateFieldSet(this, _url, url);
    }
    static makeFromJson(json) {
        return new Meme(json.id, json.name, json.price, json.url);
    }
    getId() {
        return __classPrivateFieldGet(this, _id);
    }
    getName() {
        return __classPrivateFieldGet(this, _name);
    }
    getPrices() {
        return __classPrivateFieldGet(this, _prices).slice();
    }
    getPrice() {
        return __classPrivateFieldGet(this, _prices)[0];
    }
    getUrl() {
        return __classPrivateFieldGet(this, _url);
    }
    getValues() {
        return { "id": __classPrivateFieldGet(this, _id),
            "name": __classPrivateFieldGet(this, _name),
            "price": this.getPrice(),
            "url": __classPrivateFieldGet(this, _url)
        };
    }
    setPrice(newPrice) {
        __classPrivateFieldGet(this, _prices).unshift(newPrice);
    }
    static comparePrices(a, b) {
        return b.getPrice() - a.getPrice();
    }
}
exports.Meme = Meme;
_id = new WeakMap(), _name = new WeakMap(), _prices = new WeakMap(), _url = new WeakMap();
