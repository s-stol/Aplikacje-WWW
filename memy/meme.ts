import { Module } from "module";

export class Meme {
    #id:number;
    #name:string;
    #prices:number[];
    #url:string;

   constructor(id: number, name: string, price: number, url: string) {
      this.#id = id;
      this.#name = name;
      this.#prices = [price];
      this.#url = url;
    }

    static makeFromJson(json: { id: number; name: string; price: number; url: string; }) {
        return new Meme(json.id, json.name, json.price, json.url);
    }

    getId() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getPrices() {
        return this.#prices.slice();
    }

    getPrice() {
        return this.#prices[0];
    }

    getUrl() {
        return this.#url;
    }

    getValues() {
        return {"id": this.#id,
            "name": this.#name,
            "price": this.getPrice(),
            "url": this.#url
        };
    }

    setPrice (newPrice: number) {
        this.#prices.unshift(newPrice);
    }

    static comparePrices (a: Meme, b: Meme) {
        return b.getPrice() - a.getPrice();
    }
}
