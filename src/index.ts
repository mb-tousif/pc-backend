import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
require("dotenv").config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Pc Builder Server is Running!");
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URL as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("pc-builder");
    const productCollection = database.collection("products");
    app.get("/products", async (req, res) => {
      const query = req.query.category;
      const filter = query !==undefined ? await productCollection.find({ category: query }).toArray() : await productCollection.find({}).toArray();
      // const products = await productCollection.find({}).toArray();
      res.send(filter);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      const savedProduct = await productCollection.insertOne(product).finally();
      res.send(savedProduct);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req?.params?.id;
      console.log(id);
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      console.log(product);
      res.send(product);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch((error) => {
  console.log(error);
});

app.listen(port, () => {
  console.log("Server is running in port ", port);
});
