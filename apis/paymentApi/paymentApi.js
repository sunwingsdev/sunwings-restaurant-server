const express = require("express");
const { ObjectId } = require("mongodb");

const paymentApi = (paymentsCollection) => {
  const paymentRouter = express.Router();

  //   add paymentInfo
  paymentRouter.post("/", async (req, res) => {
    const paymentInfo = req.body;
    paymentInfo.createdAt = new Date();
    const result = await paymentsCollection.insertOne(paymentInfo);
    res.send(result);
  });

  //   get all payments
  paymentRouter.get("/", async (req, res) => {
    const result = await paymentsCollection.find().toArray();
    res.send(result);
  });

  //   delete a payment by id
  paymentRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }
    const query = { _id: new ObjectId(id) };
    const result = await paymentsCollection.deleteOne(query);
    res.send(result);
  });

  return paymentRouter;
};
module.exports = paymentApi;
