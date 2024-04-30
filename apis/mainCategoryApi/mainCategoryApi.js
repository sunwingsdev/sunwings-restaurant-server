const express = require("express");
const { ObjectId } = require("mongodb");

const mainCategoryApi = (mainCategoriesCollection) => {
  const mainCategoryRouter = express.Router();

  //   post category 
  mainCategoryRouter.post("/", async (req, res) => { 
    const mainCategoryInfo = req.body;
    const result = await mainCategoriesCollection.insertOne(mainCategoryInfo);
    res.send(result);
  });

  //   get all categories
  mainCategoryRouter.get("/", async (req, res) => {
    const result = await mainCategoriesCollection.find().toArray();
    res.send(result);
  });

  //   delete a category 
  mainCategoryRouter.delete("/:id", async (req, res) => {
    const id = req.params.id; 
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }
    const query = { _id: new ObjectId(id) };
    const result = await mainCategoriesCollection.deleteOne(query);
    res.send(result);
  });
  return mainCategoryRouter;
};

module.exports = mainCategoryApi;
