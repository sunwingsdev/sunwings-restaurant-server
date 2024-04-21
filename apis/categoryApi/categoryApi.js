const express = require("express");
const { ObjectId } = require("mongodb");

const categoryApi = (categoriesCollection) => {
  const categoryRouter = express.Router();

  //   add item
  categoryRouter.post("/", async (req, res) => {
    const item = req.body;
    console.log(req.body);
    const result = await categoriesCollection.insertOne(item);
    res.send(result);
  });

  // get all categories
  categoryRouter.get("/", async (req, res) => {
    const result = await categoriesCollection.find().toArray();
    res.send(result);
  });

  // delete a category by id
  categoryRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }
    const query = { _id: new ObjectId(id) };
    const result = await categoriesCollection.deleteOne(query);
    res.send(result);
  });

  return categoryRouter; 
};

module.exports = categoryApi;
