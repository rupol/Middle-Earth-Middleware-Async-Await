// code away!
const express = require("express");

const server = require("./server");

const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");

server.use(express.json());

server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 4000;

server.use((req, res) => {
  res.status(404).json({
    message: "Route was not found"
  });
});

server.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message: "An internal error occurred, please try again later"
  });
});

server.listen(port, host, () => {
  console.log(`\n*** Server Running on http://${host}:${port} ***\n`);
});
