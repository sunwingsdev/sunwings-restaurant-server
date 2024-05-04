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
    const result = await paymentsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.send(result);
  });

  // get total order price
  paymentRouter.get("/totalOrderPrice", async (req, res) => {
    try {
      const payments = await paymentsCollection.find().toArray();
      const totalOrderPrice = payments.reduce(
        (total, payment) => total + payment.orderPrice,
        0
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the beginning of today
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Get tomorrow's date

      const result = await paymentsCollection
        .find({
          createdAt: { $gte: today, $lt: tomorrow },
        })
        .toArray();
      const todaysTotalSale = result.reduce(
        (total, payment) => total + payment.orderPrice,
        0
      );
      const cashPayments = await paymentsCollection
        .find({ paymentMethod: "cash" })
        .toArray();
      const cashTotalPrice = cashPayments.reduce(
        (total, payment) => total + payment.orderPrice,
        0
      );
      const onlinePayments = await paymentsCollection
        .find({ paymentMethod: "bkash" || "nagad" || "rocket" })
        .toArray();
      const onlineTotalPrice = onlinePayments.reduce(
        (total, payment) => total + payment.orderPrice,
        0
      );

      res.json({
        totalOrderPrice,
        todaysTotalSale,
        cashTotalPrice,
        onlineTotalPrice,
      });
    } catch (error) {
      console.error("Error calculating total order price:", error);
      res.status(500).json({ message: "Internal server error" });
    }
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
