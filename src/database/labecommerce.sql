-- Active: 1674495210543@@127.0.0.1@3306
CREATE TABLE users(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT
);

DROP TABLE users;

INSERT INTO users (id, name, email, password, created_at)
VALUES ("a001", "João", "joao@gmail.com", "1234", ""),
        ("a002", "Maria", "maria@gmail.com", "5678", ""),
        ("a003", "José", "josé@gmail.com", "0910", "");


CREATE TABLE products(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        imageUrl TEXT 
);

DROP TABLE products;

INSERT INTO products (id, name, price, description, imageUrl)
VALUES ("p001", "Café Geisha", 60.00, "Torra Média", "https://mitocafesespeciais.com.br/assets/img/dist/nivel-torra-media.png"), 
        ("p002", "Café Acaiá", 80.00, "Torra Clara", "https://mitocafesespeciais.com.br/assets/img/dist/nivel-torra-clara.png"), 
        ("p003", "Café Kona", 95.00, "Torra Escura", "https://mitocafesespeciais.com.br/assets/img/dist/nivel-torra-escura.png"),
        ("p004", "Café Catuaí", 45.00, "Torra Escura", "https://mitocafesespeciais.com.br/assets/img/dist/nivel-torra-escura.png"), 
        ("p005", "Café Robusta", 50.00, "Torra Escura", "https://mitocafesespeciais.com.br/assets/img/dist/nivel-torra-clara.png"), 
        ("p006", "Café Arábica", 40.00, "Torra Clara", "https://mitocafesespeciais.com.br/assets/img/dist/nivel-torra-clara.png"), 
        ("p007", "Café Bourbon", 60.00, "Torra Média", "https://mitocafesespeciais.com.br/assets/img/dist/nivel-torra-media.png");


--retorna todos os usuários cadastrados
SELECT * FROM users;

--retorna todos os produtos cadastrados
SELECT * FROM products;

--retorna o resultado baseado no termo de busca
SELECT * FROM products
WHERE name = "Café Kona";

--insere o item mockado na tabela users
INSERT INTO users (id, name, email, password)
VALUES ("a004", "Ana", "ana@gmail.com", "1112");

--insere o item mockado na tabela products
-- INSERT INTO products (id, name, price, description)
-- VALUES ("p008", "Café Di Pássaro", 75.00, "Torra Média"),
--         ("p009", "Café Arara", 45.00, "Torra Clara"),
--         ("p010", "Café Clássico", 34.00, "Torra Média"),
--         ("p011", "Café Mantiqueira de Minas", 38.00, "Torra Média"),
--         ("p012", "Café Chapada de Minas", 45.00, "Torra Escura"),
--         ("p013", "Café Cerrado Mineiro", 55.00, "Torra Clara"),
--         ("p0014", "Kit 3 Cafés Moídos", 120.00, "Kit"),
--         ("p015", "Kit 4 Cafés Moídos", 140.00, "Kit"),
--         ("p016", "Kit 3 Cafés em Grãos", 150.00, "Kit"),
--         ("p017", "Kit 4 Cafés Moídos", 165.00, "Kit"),
--         ("p018", "Kit 30 Cápsulas de Café", 82.00, "Kit"),
--         ("p019", "Kit 40 Cápsulas de Café", 92.00, "Kit"),
--         ("p020", "Kit 50 Cápsulas de Café", 102.00, "Kit"),
--         ("p021", "Kit 3 Drips de Café", 115.00, "Kit"),
--         ("p022", "Kit 4 Drips de Café", 125.00, "Kit"),
--         ("p023", "Kit 3 Drips de Café + 1 Café Moído", 127.00, "Kit"),
--         ("p024", "Kit 4 Drips de Café + 1 Café Moído", 137.00, "Kit");

--busca baseada no valor mockado
SELECT * FROM products
WHERE id = "p005";

--delete a linha baseada no valor mockado
DELETE FROM users 
WHERE id = "a002";

--delete a linha baseada no valor mockado
DELETE FROM products
WHERE id = "p004";

--Edit User by id: edite a linha baseada nos valores mockados
UPDATE users
SET email = "joao@outlook.com", password = "1123"
WHERE id = "a001";

--Edit Product by id: edite a linha baseada nos valores mockados
UPDATE products 
SET price = 85.00 
WHERE id = "p003";

--retorna o resultado ordenado pela coluna email em ordem crescente
SELECT * FROM users
ORDER BY email ASC;

--retorna o resultado ordenado pela coluna price em ordem crescente
--limite o resultado em 20 iniciando pelo primeiro item
SELECT * FROM products
ORDER BY price ASC
LIMIT 20;

--mocke um intervalo de preços, por exemplo entre 100.00 e 300.00
--retorna os produtos com preços dentro do intervalo mockado em ordem crescente
SELECT * FROM products
WHERE price >= 50 AND price <=100
ORDER BY price ASC;

--Criação da tabela de pedidos
CREATE TABLE purchases(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        totalPrice REAL NOT NULL,
        paid INTEGER NOT NULL,
        delivered_at TEXT,
        buyerd_id TEXT NOT NULL,
        FOREIGN KEY (buyerd_id) REFERENCES users (id)
);

DROP TABLE purchases;

--Crie dois pedidos para cada usuário cadastrado
INSERT INTO  purchases (id, totalPrice, paid, buyerd_id)
VALUES ("pr001", 165.00, 0, "a001"),
        ("pr002", 95.00, 0, "a001"),
        ("pr003", 80.00, 0, "a003"),
        ("pr004", 45.00, 0, "a003");

SELECT * FROM purchases;

--Edite o status da data de entrega de um pedido
UPDATE purchases
SET delivered_at = datetime()
WHERE id = "pr002";

--simular um endpoint de histórico de compras de um determinado usuário.
SELECT * FROM purchases
INNER JOIN users
ON purchases.buyerd_id = users.id
WHERE users.id = "a001";

--Criação da tabela de relações
CREATE TABLE purchases_products(
        purchase_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (purchase_id) REFERENCES purchases (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
);

DROP TABLE purchases_products;

--Popule sua tabela purchases_products simulando 3 compras de clientes.
INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES ("pr001", "p017", 1),
        ("pr002", "p003", 1),
        ("pr003", "p002", 1);

SELECT * FROM purchases_products;

SELECT 
purchases.id AS purchaseId,
purchases.total_price AS totalPrice,
purchases.paid,
purchases.delivered_at AS deliveredAt,
purchases.buyerd_id AS buyerdId,
products.id AS productId,
products.name AS productName,
products.price
FROM purchases
LEFT JOIN purchases_products
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
on purchases_products.product_id = products.id;

