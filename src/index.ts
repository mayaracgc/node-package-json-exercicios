import { users, products, purchase, createUser, createProduct, createPurchase} from "./database";
import { CATEGORY, TProduct, TPurchase, TUser} from "./types";
import express, {query, Request, Response} from "express";
import cors from "cors";
import { knex } from "knex";
import { db } from "./database/knex";
import { brotliDecompress } from "zlib";


const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
});

app.get("/ping", (req: Request, res: Response) => {
    res.send('Pong!')
});

app.get("/users", async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`
        SELECT * FROM users;
        `)
        res.status(200).send({Usuários: result})

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.get("/products", async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`
        SELECT * FROM products;
        `)
        res.status(200).send({Produtos: result})

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.get("/products/search", async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string 

        if(q !== undefined){
            if(q.length < 1){
                res.status(404)
                throw new Error("'q' deve possuir ao menos um caracter.")
            }
        }else{
            res.status(400)
            throw new Error("'q' precisa ser definido.")
        }
        
        const result = await db.raw(`
            SELECT * FROM products
            WHERE id = "${q}";
        `)
        res.status(200).send({Produto: result})

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.post("/users", async (req: Request, res: Response) => {
    try {
        const {id, name, email, password, created_at} = req.body;

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("Id deve ser uma string.")
        }
        if(typeof name !== "string"){
            res.status(400)
            throw new Error("Name deve ser uma string.")
        }
        if(typeof email !== "string"){
            res.status(400)
            throw new Error("Email deve ser uma string.")
        }
        if(typeof password !== "string"){
            res.status(400)
            throw new Error("Password deve ser uma string.")
        }
        // if(typeof created_at !== "string"){
        //     res.status(400)
        //     throw new Error("Created_at deve ser uma string.")
        // }
        if(id.length < 1 || name.length < 1 || email.length < 1 || password.length < 1){
            res.status(400)
            throw new Error("Id, name, email e password devem ter no mínimo 1 caractere.")
        }

        await db.raw(`
        INSERT INTO users (id, name, email, password)
        VALUES ("${id}", "${name}", "${email}", "${password}");
        `)
        await db.raw(`
        UPDATE users
        SET created_at = DATE('now')
        WHERE id = "${id}";
        `)

        res.status(200).send(`${name} cadastrado com sucesso!`)

    } catch (error: any) {
                console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.post("/products", async (req: Request, res: Response) => {
    try {
        const {id, name, price, description, imageUrl} = req.body;
        
        if(typeof id !== "string"){
            res.status(400)
            throw new Error("Id deve ser uma string.")
        }
        if(typeof name !== "string"){
            res.status(400)
            throw new Error("Name deve ser uma string.")
        }
        if(typeof price !== "number"){
            res.status(400)
            throw new Error("Price deve ser um number.")
        }
        if(typeof description !== "string"){
                res.status(400)
                throw new Error("Description deve ser Torra Clara, Torra Média ou Torra Escura.")
            }
            if(typeof imageUrl !== "string"){
                res.status(400)
                throw new Error("ImageUrl deve ser uma string.")
            }
            await db.raw(`
            INSERT INTO products (id, name, price, description, imageUrl)
            VALUES ("${id}", "${name}", "${price}", "${description}", "${imageUrl}");
            `)
            res.status(200).send(`${name} cadastrado com sucesso!`)

        }catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.post("/purchase", async (req: Request, res: Response) => {
    try {
        const {id, totalPrice, paid, delivered_at, buyerd_id} = req.body

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("Id deve ser uma string.")
        }
        if(typeof totalPrice !== "number"){
            res.status(400)
            throw new Error("TotalPrice deve ser um number.")
        }
        if(paid > 1 && paid < 0){
            res.status(400)
            throw new Error("Paid deve ser 0 ou 1.")
        }
        // if(typeof delivered_at !== "string"){
        //     res.status(400)
        //     throw new Error("Delivered_at deve ser uma string.")
        // }
            if(typeof buyerd_id !== "string"){
            res.status(400)
            throw new Error("Buyerd_id deve ser uma string.")
        }

        await db.raw(`
        INSERT INTO purchases (id, totalPrice, paid, buyerd_id)
        VALUES ("${id}", "${totalPrice}", "${paid}", "${buyerd_id}");
        `)

        await db.raw(`
        UPDATE purchases
        SET delivered_at = DATE('now')
        WHERE id = "${id}";
        `)

        res.status(200).send("Compra cadastrada com sucesso!")

    } catch (error: any) {
                console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }

});

app.get("/products/:id", async (req:Request, res: Response) => {
    try {
        const id = req.params.id
        const result = await db.raw(`
        SELECT * FROM products
        WHERE id = "${id}";
        `)

        if(!result){
            res.status(404)
            throw new Error("Produto não encontrado. Verifique o 'id'.")
        }

        res.status(200).send({Produto: result})

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.get("/users/:id/purchase", async (req: Request, res: Response) => {
    try {
        const id = req.params.id 
        const result = await db.raw(`
        SELECT * FROM purchases
        WHERE buyerd_id = "${id}";
        `)

        if(!result){
            res.status(404)
            throw new Error("Compra não encontrada.")
        }
        res.status(200).send({Compra: result})

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const [ user ] = await db("users").where({id: id})

        if(user.id[0] !== "a"){
            res.status(400)
            throw new Error("Id inválido. Usuário deve iniciar com a letra 'a'.")
        }

        await db("users").del().where({id: id})

        res.status(200).send("Usuário desligado com sucesso!")

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.delete("/products/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const [ product ] = await db("products").where({id: id})

        if(product.id[0] !== "p"){
            res.status(400)
            throw new Error("Id inválido. Produto deve iniciar com a letra 'p'.")
        }

        await db("products").del().where({id: id})

        res.status(200).send("Produto desligado com sucesso!")

    } catch (error: any) {
                console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.put("/users/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newId = req.body.id 
        const newName = req.body.name 
        const newEmail = req.body.email 
        const newPassword = req.body.password 

        if(newId !== undefined){
            if(typeof newId !== "string"){
                res.status(400)
                throw new Error("'id' inválido. id deve ser uma string.")
            }
            if(newId[0] !== "a"){
                res.status(400)
                throw new Error("'id' inválido. Deve iniciar com a letra 'a'.")
            }
        }
        if(newName !== undefined){
            if(typeof newName !== "string"){
                res.status(400)
                throw new Error("NewName deve ser uma string.")
            }
        }
        if(newEmail !== undefined){
            if(typeof newEmail !== "string"){
                res.status(400)
                throw new Error("NewEmail deve ser uma string.")
            }
        }
        if(newPassword !== undefined){
            if(newPassword.length < 2){
                res.status(400)
                throw new Error("NewPassword deve conter mais de 2 caracteres.")
            }
        }
    
        const [user] = await db("users").where({id: id})
    
        if(user){
            const updateUser = {
            id: newId || user.id,
            name: newName || user.name,
            email: newEmail || user.email,
            password: newPassword || user.password
            }
        await db("users").update(updateUser).where({id: id})
        }else{
            res.status(404)
            throw new Error("Id não encontrada.")
        }

        res.status(200).send("Cadastro atualizado com sucesso!")

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.put("/products/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newId = req.body.id 
        const newName = req.body.name
        const newPrice = req.body.price
        const newDescripition = req.body.description
        const newImageUrl = req.body.imageUrl

        if(newId !== undefined){
            if(typeof newId !== "string"){
                res.status(400)
                throw new Error("'id' inválido. id deve ser uma string.")
            }
            if(newId[0] !== "p"){
                res.status(400)
                throw new Error("'id' inválido. Deve iniciar com a letra 'p'.")
            }
        }
        if(newName !== undefined){
            if(typeof newName !== "string"){
                res.status(400)
                throw new Error("NewName deve ser uma string.")
            }
        }
        if(newPrice !== undefined){
            if(typeof newPrice !== "number"){
                res.status(400)
                throw new Error("NewPrice deve ser um number.")
            }
            if(newPrice < 0){
                res.status(400)
                throw new Error("Price não deve ser negativo")
            }
        }
        if(newDescripition !== undefined){
            if(typeof newDescripition !== "string"){
                res.status(400)
                throw new Error("NewDescription deve ser uma string.")
            }
        }
        if(newImageUrl !== undefined){
            if(typeof newImageUrl !== "string"){
                res.status(400)
                throw new Error("newImageUrl deve ser uma string.")
            }
        }
    
        const [product] = await db("products").where({id: id})
    
        if(product){
            const updateProduct = {
            id: newId || product.id,
            name: newName || product.name,
            description: newDescripition || product.description,
            imageUrl: newImageUrl || product.imageUrl,
    
            price: isNaN(newPrice) ? product.price: newPrice
            }
            await db("products").update(updateProduct).where({id: id})
        }

        res.status(200).send("Produto atualizado com sucesso!")

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});