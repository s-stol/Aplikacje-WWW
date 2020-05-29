import meme = require('./meme.js');
import memeData = require('./memeData.js');

export class MemeList {
    #list:meme.Meme[];

    constructor(list: meme.Meme[]) {
        this.#list = list;
    }

    getBestMemes() {
        const tempList = this.#list.sort(meme.Meme.comparePrices).slice(0, 3);
        const resList = [];
        tempList.forEach(element => {
            resList.push(element.getValues());
        });
        return resList;
    }

    getMeme(id: number) {
        const result = this.#list.find(item => {return (item.getId() === id as number)});
        return result;
    }
}

const memeArr: meme.Meme[] = [];
memeData.mostExpensive.forEach((value) => {memeArr.push(meme.Meme.makeFromJson(value))})
export const exampleMemes = new MemeList(memeArr);