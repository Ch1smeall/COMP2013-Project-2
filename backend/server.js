//initializing server
const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose");//import username
require("dotenv").config();
const {DB_URI} = process.env;//grab same variable in dotenv
const cors = require("cors");// for disabling browser security
const Product = require("./models/products");

//middleware
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(cors());

//database connection
mongoose.connect(DB_URI).then(() => {
    server.listen(port, () => {
        console.log(`Database is connected\nServer is listening on ${port}`);
    });
}).catch((error) => console.log(error.message));


//server root route
server.get("/", (request, response) => {
    response.send("server is live");
});

//retrieve
server.get("/groceryProduct", async (request, response) => {
    try{
        const items = await Product.find();
        response.send(items);
    }catch(error){
        response.status(500).send({message: error.message});
    };
});

//add
server.post("/groceryProduct", async(request,response) => {
    const id = crypto.randomUUID();
    const {productName, price, brand, image} = request.body;
    const newProduct = new Product({
        productName,
        price,
        brand,
        image,
        id,
    });
    try{
        await newProduct.save();
        response.status(200).send({message: "product is added"});
    }catch(error){
        response.status(400).send({message: error.message});
    };
});

server.get("/groceryProduct/:id", async (request, response) => {
  const {id} = request.params;
  try{
    const productToEdit = await Product.findById(id);
    response.send(productToEdit);
  }catch(error){
    response.status(500).send({message: error.message});
  }
});

server.patch("/groceryProduct/:id", async (request, response) => {
  const{id} = request.params;
  const{productName, brand, image, price} = request.body;
  try{
    await Product.findByIdAndUpdate(id, {
      productName,
      brand,
      image,
      price
    });
    response.send({message: `${productName} now has id: ${id}`});
  }catch(error){
    response.status(500).send({message: error.message});
  }
});

server.delete("/groceryProduct/:id",async (request, response) => {
  const { id } = request.params;
  try{
    await Product.findByIdAndDelete(id);
    response.send({message: `product delted`});
  }catch(error){
    response.status(400).send({ message: error.message });
  };
});


