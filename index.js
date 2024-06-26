const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// import api modules
const usersApi = require("./apis/usersApi/usersApi");
const itemApi = require("./apis/itemApi/itemApi");
const categoryApi = require("./apis/categoryApi/categoryApi");
const mainCategoryApi = require("./apis/mainCategoryApi/mainCategoryApi");
const paymentApi = require("./apis/paymentApi/paymentApi");

const corsConfig = {
  origin: ["http://localhost:5173", "https://sunwings-restaurant.web.app", "*"],
  credentials: true,
  optionSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
};

// middlewares
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(express.json());

// mongodb start from here
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.wjtd458.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collection start here
    const usersCollection = client
      .db("sunwings-restaurant")
      .collection("users");
    const itemCollection = client.db("sunwings-restaurant").collection("items");
    const categoriesCollection = client
      .db("sunwings-restaurant")
      .collection("categories");
    const mainCategoriesCollection = client
      .db("sunwings-restaurant")
      .collection("mainCategories");
    const paymentsCollection = client
      .db("sunwings-restaurant")
      .collection("payments");
    // collection end here

    // apis start here
    app.use("/users", usersApi(usersCollection));
    app.use("/item", itemApi(itemCollection));
    app.use("/categories", categoryApi(categoriesCollection));
    app.use("/mainCategories", mainCategoryApi(mainCategoriesCollection));
    app.use("/payments", paymentApi(paymentsCollection));
    // apis end here

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!!✅");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// mongodb end here

// basic setup
app.get("/", (req, res) => {
  res.send("Sunwings Restaurant Server is Running.");
});

app.listen(port, () => {
  console.log(`Sunwings Restaurant Server is Running on PORT:🆗 ${port}`);
});
