-- Active: 1674495210543@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

DROP TABLE users;

INSERT INTO users (id, name, email, password)
VALUES ("a001", "João", "joao@gmail.com", "1234"),
        ("a002", "Maria", "maria@gmail.com", "5678"),
        ("a003", "José", "josé@gmail.com", "0910");

SELECT * FROM users;

CREATE TABLE products(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);

DROP TABLE products;

INSERT INTO products (id, name, price, category)
VALUES ("p001", "Café Geisha", 60.0, "Torra Média"), 
        ("p002", "Café Acaiá", 80.0, "Torra Clara"), 
        ("p003", "Café Kona", 95.0, "Torra Escura"),
        ("p004", "Café Catuaí", 45.0, "Torra Escura"), 
        ("p005", "Café Robusta", 50.0, "Torra Escura"), 
        ("p006", "Café Arábica", 40.0, "Torra Clara"), 
        ("p007", "Café Bourbon", 60.0, "Torra Média");

SELECT * FROM products;