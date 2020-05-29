import meme = require('../meme.js');
import memeList = require('../memeList.js');
import {expect} from 'chai';

describe('Meme', () => {
    context('Meme', () => {
        it('should return correct get values', () => {
            const mem = new meme.Meme(1, 'mem', 1234, 'example');
            expect(mem.getId()).to.equal(1);
            expect(mem.getId()).not.to.equal(2);
            expect(mem.getName()).to.equal('mem');
            expect(mem.getPrice()).to.equal(1234);
            expect(mem.getUrl()).to.equal('example');
        });

        it('should be able to make meme from json', () => {
            const json = {'id': 2,
            'name': 'innyMem',
            'price': 2345,
            'url': 'example2'}
            const mem2 = meme.Meme.makeFromJson(json);
            expect(mem2.getId()).to.equal(2);
            expect(mem2.getId()).not.to.equal(3);
            expect(mem2.getName()).to.equal('innyMem');
            expect(mem2.getPrice()).to.equal(2345);
            expect(mem2.getUrl()).to.equal('example2');
        });

        it('should correctly set price', () => {
            const mem = new meme.Meme(1, 'mem', 1234, 'example');
            mem.setPrice(50);
            expect(mem.getPrice()).to.equal(50);
        });

        it('should return array with prices', () => {
            const mem = new meme.Meme(1, 'mem', 1234, 'example');
            mem.setPrice(50);
            const prices = mem.getPrices();
            expect(prices[0]).to.equal(50);
            expect(prices[1]).to.equal(1234);
        });

        it('should not allow changing price history', () => {
            const mem = new meme.Meme(1, 'mem', 1234, 'example');
            mem.setPrice(50);
            const prices = mem.getPrices();
            prices[0] = 99;
            expect(mem.getPrice()).to.equal(50);
            expect(mem.getPrices()[0]).to.equal(50);
        });

        it('should return correct json', () => {
            const mem = new meme.Meme(1, 'mem', 1234, 'example');
            const values = mem.getValues();
            expect(values.id).to.equal(1);
            expect(values.name).to.equal('mem');
            expect(values.price).to.equal(1234);
            expect(values.url).to.equal('example');
        });
    });

    context('MemeList', () => {
        const exampleMemes = [
            new meme.Meme(10,
            'Gold',
            1000,
            'https://i.redd.it/h7rplf9jt8y21.png'),
            new meme.Meme(9,
            'Platinum',
            1100,
            'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg'),
            new meme.Meme(8,
            'Elite',
            1200,
            'https://i.imgflip.com/30zz5g.jpg'),
            new meme.Meme(7,
            'Sodium',
            123,
            'anotherExample')
        ];

        it('should return correct 3 memes', () => {
            const memList = new memeList.MemeList(exampleMemes);
            const returned = memList.getBestMemes();
            const find1 = returned.find((value) => {return value.id === 8});
            const find2 = returned.find((value) => {return value.id === 7});
            const find3 = returned.find((value) => {return value.id === 10});
            const find4 = returned.find((value) => {return value.id === 9});
            expect(find1).not.to.equal(undefined);
            expect(find2).to.equal(undefined);
            expect(find3).not.to.equal(undefined);
            expect(find4).not.to.equal(undefined);
        });

        it('should allow changing price', () => {
            const memList = new memeList.MemeList(exampleMemes);
            const mem = memList.getMeme(9);
            mem.setPrice(1121);
            expect(memList.getMeme(9).getPrice()).to.equal(1121);
        });

        it('should return correct memes after price change', () => {
            const memList = new memeList.MemeList(exampleMemes);
            const mem = memList.getMeme(9);
            mem.setPrice(10);
            const returned = memList.getBestMemes();
            const find1 = returned.find((value) => {return value.id === 8});
            const find2 = returned.find((value) => {return value.id === 7});
            const find3 = returned.find((value) => {return value.id === 10});
            const find4 = returned.find((value) => {return value.id === 9});
            expect(find1).not.to.equal(undefined);
            expect(find2).not.to.equal(undefined);
            expect(find3).not.to.equal(undefined);
            expect(find4).to.equal(undefined);
        });
    });
})