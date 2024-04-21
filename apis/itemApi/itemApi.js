const express = require("express");

const itemApi = (itemCollection) => {
  const itemRouter = express.Router();

  //   add item
  itemRouter.post("/", async (req, res) => {
    const item = req.body;
    console.log(req.body);
    const result = await itemCollection.insertOne(item);
    res.send(result);
  });

  // get items
  itemRouter.get("/", async (req, res) => {
    const result = await itemCollection.find().toArray();
    res.send(result);
  });

  return itemRouter;
};

module.exports = itemApi;
