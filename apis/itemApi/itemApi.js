const express = require("express");
const { ObjectId } = require("mongodb");

const itemApi = (itemCollection) => {
  const itemRouter = express.Router();

  //   add item
  itemRouter.post("/", async (req, res) => {
    const item = req.body;
    const result = await itemCollection.insertOne(item);
    res.send(result);
  });

  // get items
  itemRouter.get("/", async (req, res) => {
    const result = await itemCollection.find().toArray();
    res.send(result);
  });

  // delete a item
  itemRouter.delete("/:id", async (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }
    const query = { _id: new ObjectId(id) };
    const result = await itemCollection.deleteOne(query);
    res.send(result);
  });

  return itemRouter;
};

module.exports = itemApi;
