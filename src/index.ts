import { users, products, purchase, createUser, createProduct, createPurchase} from "./database";
import { CATEGORY, TProduct, TPurchase, TUser} from "./types";
import express, {query, Request, Response} from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
});

app.get("/ping", (req: Request, res: Response) => {
    res.send('Pong!')
});

app.get("/users", (req: Request, res: Response) => {
    try {
        res.status(200).send(users)

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.get("/products", (req: Request, res: Response) => {
    try {
        res.status(200).send(products)

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.get("/users/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const result = users.find((users) => users.id === id)

        if (!result){
            res.status(404)
            throw new Error("Conta não encontrada")
        }
        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.get("/products/search", (req: Request, res: Response) => {
    try {
        const q = req.query.q as string 
        const result : TProduct[] = products.filter((products) => 
        products.name.toLowerCase().includes(q.toLowerCase()))

        if(!result){
            res.status(404)
            throw new Error("Produto não encontrado. Verifique a 'id'.")
        }
        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.post("/users", (req: Request, res: Response) => {
    try {
        const id = req.body.id as string
        const email = req.body.email as string
        const password = req.body.password as string

        if(typeof id !== "string"){
            return res.status(400).send("Id deve ser uma string.")
        }
        if(typeof email !== "string"){
            return res.status(400).send("Email deve ser uma string.")
        }
        if(typeof password !== "string"){
            return res.status(400).send("Password deve ser uma string.")
        }
        
        const newUser: TUser = {
            id,
            email,
            password
        }
        users.push(newUser)

        res.status(201).send("Cadastro realizado com sucesso!")

    } catch (error: any) {
                console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.post("/products", (req: Request, res: Response) => {
    try {
        const id = req.body.id as string
        const name = req.body.name as string
        const price = req.body.price as number
        const category = req.body.category as CATEGORY
        
        if(typeof id !== "string"){
            return res.status(400).send("Id deve ser uma string.")
        }
        if(typeof name !== "string"){
            return res.status(400).send("Name deve ser uma string.")
        }
        if(typeof price !== "number"){
            return res.status(400).send("Price deve ser um number.")
        }
        if(typeof category !== undefined){
            if(
                category !== "Torra Clara" &&
                category !== "Torra Média" &&
                category !== "Torra Escura"
            ){
                return res.status(400).send("Category deve ser uma uma categoria válida.")
            }
        }
    
        const newProduct: TProduct = {
            id,
            name,
            price,
            category
        }
        products.push(newProduct)
        res.status(201).send("Produto cadastrado com sucesso!")

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.post("/purchase", (req: Request, res: Response) => {
    try {
        const userId = req.body.userId as string
        const productId = req.body.productId as string
        const quantity = req.body.quantity as number
        const totalPrice = req.body.totalPrice as number

        if(typeof userId !== "string"){
            return res.status(400).send("UserId deve ser uma string.")
        }
        if(typeof productId !== "string"){
            return res.status(400).send("ProductId deve ser uma string.")
        }
        if(typeof quantity !== "number"){
            return res.status(400).send("Quantity deve ser um number.")
        }
        if(typeof totalPrice !== "number"){
            return res.status(400).send("TotalPrice deve ser uma string.")
        }
    
        const newPurchase: TPurchase = {
        userId,
        productId,
        quantity,
        totalPrice
        }
        purchase.push(newPurchase)
        res.status(201).send("Produto cadastrado com sucesso!")

    } catch (error: any) {
                console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }

});

app.get("/products/:id", (req:Request, res: Response) => {
    try {
        const id = req.params.id
        const result = products.find((products) => products.id === id)

        if(!result){
            res.status(404)
            throw new Error("Produto não encontrado. Verifique o 'id'.")
        }

        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }

});

app.get("/users/:id/purchase", (req: Request, res: Response) => {
    try {
        const id = req.params.id 
        const result = purchase.find((purchase) => purchase.userId === id)

        if(!result){
            res.status(404)
            throw new Error("Compra não encontrada.")
        }
        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.delete("/users/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id
        if(id[0] !== "a"){
            res.status(400)
            throw new Error("Id inválido. Usuário deve iniciar com a letra 'a'.")
        }

        const usersIndex = users.findIndex((users) => users.id === id)
        if(usersIndex >= 0){
            users.splice(usersIndex, 1)
        }

        res.status(200).send("Usuário desligado com sucesso!")

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.delete("/products/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id
        if(id[0] !== "b"){
            res.status(400)
            throw new Error("Id inválido. Produto deve iniciar com a letra 'b'.")
        }

        const productsIndex = products.findIndex((products) => products.id === id)
        if(productsIndex >= 0){
            users.splice(productsIndex, 1)
        }

        res.status(200).send("Produto desligado com sucesso!")

    } catch (error: any) {
                console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
});

app.put("/users/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newId = req.body.id as string | undefined
        const newEmail = req.body.email as string | undefined
        const newPassword = req.body.password as string | undefined

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
    
        const user = users.find((user) => user.id === id)
    
        if(user){
            user.id = newId || user.id
            user.email = newEmail || user.email
            user.password = newPassword || user.password
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

app.put("/products/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newId = req.body.id as string | undefined
        const newName = req.body.name as string | undefined
        const newPrice = req.body.price as number | undefined
        const newCategory = req.body.category as CATEGORY | undefined

        if(newId !== undefined){
            if(typeof newId !== "string"){
                res.status(400)
                throw new Error("'id' inválido. id deve ser uma string.")
            }
            if(newId[0] !== "b"){
                res.status(400)
                throw new Error("'id' inválido. Deve iniciar com a letra 'b'.")
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
        if(typeof newCategory !== undefined){
            if(
                newCategory !== "Torra Clara" &&
                newCategory !== "Torra Média" &&
                newCategory !== "Torra Escura"
            ){
                return res.status(400).send("Category deve ser uma uma categoria válida.")
            }
        }
    
        const product = products.find((product) => product.id ===id)
    
        if(product){
            product.id = newId || product.id
            product.name = newName || product.name
            product.category = newCategory || product.category
    
            product.price = isNaN(newPrice) ? product.price: newPrice
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