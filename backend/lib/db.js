import Database from "better-sqlite3";


export function initDb(path = ":memory:") {
const db = new Database(path);
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS cart (
product_id TEXT PRIMARY KEY,
qty INTEGER NOT NULL
);
`);
return db;
}


export function loadCart(db) {
const rows = db.prepare("SELECT product_id, qty FROM cart").all();
const map = new Map();
rows.forEach(r => map.set(r.product_id, r.qty));
return map;
}


export function saveCart(db, cartMap) {
const tx = db.transaction(() => {
db.prepare("DELETE FROM cart").run();
const ins = db.prepare("INSERT INTO cart(product_id, qty) VALUES(?, ?)");
for (const [pid, qty] of cartMap.entries()) ins.run(pid, qty);
});
tx();
}