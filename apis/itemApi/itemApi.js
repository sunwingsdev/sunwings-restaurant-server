const express = require("express");
const { ObjectId } = require("mongodb");

const itemApi = (itemCollection) => {
  const itemRouter = express.Router();

  //   add item
  itemRouter.post("/", async (req, res) => {
    const item = req.body;
    item.createdAt = new Date();
    const result = await itemCollection.insertOne(item);
    res.send(result);
  });

  //   edit a  item
  itemRouter.put("/edit/:id", async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }
    const query = { _id: new ObjectId(id) };
    const itemInfo = req.body;
    // console.log(18, id, itemInfo);
    const options = { upsert: true };
    const time = new Date();
    const updatedInfo = {
      $set: {
        name: itemInfo.name,
        details: itemInfo.details,
        price: itemInfo.price,
        category: itemInfo.category,
        subCategory: itemInfo.subCategory,
        discount: itemInfo.discount,
        stock: itemInfo.stock,
        updatedAt: time,
      },
    };

    // console.log(query, updatedInfo);
    const result = await itemCollection.updateOne(query, updatedInfo, options);
    res.send(result);
  });

  // get items
  itemRouter.get("/", async (req, res) => {
    const result = await itemCollection.find().toArray();
    res.send(result);
  });

  // delete a item
  itemRouter.delete("/:id", async (req, res) => {
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
