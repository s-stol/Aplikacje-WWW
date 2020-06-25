import sqlite3 = require('sqlite3');

const db = new sqlite3.Database('meme.db');
db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS memes`);
    db.run(`DROP TABLE IF EXISTS users`);

    db.run(`CREATE TABLE memes(id INTEGER NOT NULL PRIMARY KEY, name TEXT, prices TEXT, url TEXT, price INTEGER);`)

    db.run(`INSERT INTO memes VALUES(10, 'Gold', '[{"price":1000,"user":"admin"}]','https://i.redd.it/h7rplf9jt8y21.png', 1000);`)
    db.run(`INSERT INTO memes VALUES(9, 'Platinum', '[{"price":1100,"user":"admin"}]','http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg', 1100);`)
    db.run(`INSERT INTO memes VALUES(8, 'Elite', '[{"price":1200,"user":"admin"}]','https://i.imgflip.com/30zz5g.jpg', 1200);`);

    db.run(`CREATE TABLE users(username TEXT NOT NULL PRIMARY KEY, passhash TEXT, salt TEXT);`)

    db.run(`INSERT INTO users VALUES('admin', '651499bc84af30edb5b8c2c7b63f33204c58551258f6f430ccf44e65981469a23de9de9afa6912d62021c2f6ad1a9670b3711865abd93aa5ff5894ae239929d7', 'DAD2D47A21313190363BDC7263AE9D78');`)
    db.run(`INSERT INTO users VALUES('user', '9ff5fb5f11ac382d0ecb81f8ecdb5ee7596e6db4159e1abf4fc337f825177221db5b28d2461a6ce0505d428318d3e7eebbbf8db0d755dffc6e9e1afb169cbd04', '56E592548D14782D6B801116A2D9A521');`)
})

db.close()