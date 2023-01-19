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

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
});

app.get('/users', (req: Request, res: Response) => {
    res.status(200).send(users)
});

app.get('/products', (req: Request, res: Response) => {
    res.status(200).send(products)
});

app.get('/products/search', (req: Request, res: Response) => {
    const q = req.query.q as string 
    const result : TProduct[] = products.filter((products) => 
    products.name.toLowerCase().includes(q.toLowerCase()))
    res.status(200).send(result)
});

app.post('/users', (req: Request, res: Response) => {
    const id = req.body.id as string
    const email = req.body.email as string
    const password = req.body.password as string

    const newUser: TUser = {
        id,
        email,
        password
    }
    users.push(newUser)
    res.status(201).send("Cadastro realizado com sucesso!")
});

app.post('/products', (req: Request, res: Response) => {
    const id = req.body.id as string
    const name = req.body.name as string
    const price = req.body.price as number
    const category = req.body.category as CATEGORY

    const newProduct: TProduct = {
        id,
        name,
        price,
        category
    }
    products.push(newProduct)
    res.status(201).send("Produto cadastrado com sucesso!")
});

app.post('/purchase', (req: Request, res: Response) => {
    const userId = req.body.userId as string
    const productId = req.body.productId as string
    const quantity = req.body.quantity as number
    const totalPrice = req.body.totalPrice as number

    const newPurchase: TPurchase = {
    userId,
    productId,
    quantity,
    totalPrice
    }
    purchase.push(newPurchase)
    res.status(201).send("Produto cadastrado com sucesso!")
});

app.get('/products/:id', (req:Request, res: Response) => {
    const id = req.params.id
    const result = products.find((products) => products.id === id)
    res.status(200).send(result)
});

app.get('/users/:id/purchase', (req: Request, res: Response) => {
    const id = req.params.id 
    const result = purchase.find((purchase) => purchase.userId === id)
    res.status(200).send(result)
});

app.delete('/users/:id', (req: Request, res: Response) => {
    const id = req.params.id
    const usersIndex = users.findIndex((users) => users.id === id)
    if(usersIndex >= 0){
        users.splice(usersIndex, 1)
    }
    res.status(200).send("Usuário desligado com sucesso!")
});

app.delete('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id
    const productsIndex = products.findIndex((products) => products.id === id)
    if(productsIndex >= 0){
        users.splice(productsIndex, 1)
    }
    res.status(200).send("Produto desligado com sucesso!")
});

app.put('/users/:id', (req: Request, res: Response) => {
    const id = req.params.id

    const newId = req.body.id as string | undefined
    const newEmail = req.body.email as string | undefined
    const newPassword = req.body.password as string | undefined

    const user = users.find((user) => user.id ===id)

    if(user){
        user.id = newId || user.id
        user.email = newEmail || user.email
        user.password = newPassword || user.password
    }
    res.status(200).send("Cadastro atualizado com sucesso!")
});

app.put('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id

    const newId = req.body.id as string | undefined
    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number 
    const newCategory = req.body.category as CATEGORY | undefined

    const product = products.find((product) => product.id ===id)

    if(product){
        product.id = newId || product.id
        product.name = newName || product.name
        product.category = newCategory || product.category

        product.price = isNaN(newPrice) ? product.price: newPrice
    }
    res.status(200).send("Produto atualizado com sucesso!")
});