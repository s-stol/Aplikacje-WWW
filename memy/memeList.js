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
var _list;
Object.defineProperty(exports, "__esModule", { value: true });
const meme = require("./meme.js");
const memeData = require("./memeData.js");
class MemeList {
    constructor(list) {
        _list.set(this, void 0);
        __classPrivateFieldSet(this, _list, list);
    }
    getBestMemes() {
        const tempList = __classPrivateFieldGet(this, _list).sort(meme.Meme.comparePrices).slice(0, 3);
        const resList = [];
        tempList.forEach(element => {
            resList.push(element.getValues());
        });
        return resList;
    }
    getMeme(id) {
        const result = __classPrivateFieldGet(this, _list).find(item => { return (item.getId() === id); });
        return result;
    }
}
exports.MemeList = MemeList;
_list = new WeakMap();
const memeArr = [];
memeData.mostExpensive.forEach((value) => { memeArr.push(meme.Meme.makeFromJson(value)); });
exports.exampleMemes = new MemeList(memeArr);
