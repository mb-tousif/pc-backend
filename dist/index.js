"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("mongodb");
require("dotenv").config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Pc Builder Server is Running!");
});
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new mongodb_1.MongoClient(process.env.DB_URL, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const database = client.db("pc-builder");
            const productCollection = database.collection("products");
            app.get("/products", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const query = req.query.category;
                const filter = query !== undefined ? yield productCollection.find({ category: query }).toArray() : yield productCollection.find({}).toArray();
                // const products = await productCollection.find({}).toArray();
                res.send(filter);
            }));
            app.post("/products", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const product = req.body;
                const savedProduct = yield productCollection.insertOne(product).finally();
                res.send(savedProduct);
            }));
            app.get("/products/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
                console.log(id);
                const product = yield productCollection.findOne({
                    _id: new mongodb_1.ObjectId(id),
                });
                console.log(product);
                res.send(product);
            }));
        }
        finally {
            // Ensures that the client will close when you finish/error
            // await client.close();
        }
    });
}
run().catch((error) => {
    console.log(error);
});
app.listen(port, () => {
    console.log("Server is running in port ", port);
});
//# sourceMappingURL=index.js.map