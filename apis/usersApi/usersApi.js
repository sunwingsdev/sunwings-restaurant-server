const express = require("express");

const usersApi = (usersCollection) => {
  const userRouter = express.Router();

  //   add user
  userRouter.post("/", async (req, res) => {
    const userInfo = req.body;
    userInfo.createdAt = new Date();
    const result = await usersCollection.insertOne(userInfo);
    res.send(result);
  });

  // get all user
  userRouter.get("/", async (req, res) => {
    const result = await usersCollection.find().toArray();
    res.send(result);
  });

  // get a single user
  userRouter.get("/:uid", async (req, res) => {
    const uid = req.params.uid;
    const query = { uid: uid };
    const result = await usersCollection.findOne(query);
    res.send(result);
  });

  // delete a user
  userRouter.delete("/:uid", async (req, res) => {
    const uid = req.params.uid;
    const query = { uid: uid };
    const result = await usersCollection.deleteOne(query);
    res.send(result);
  });

  return userRouter;
};

module.exports = usersApi;
