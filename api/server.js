const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./contacts/contacts.routers");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

module.exports = class UsersServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
  }

  async initServer() {
    try {
      this.server = express();
      await mongoose.connect(process.env.MONGDB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database connection successful");
      this.server.use(morgan("combined"));
    } catch (err) {
      console.log(err.message);
      process.exit(1);
    }
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: "http://localhost:3000/" }));
  }

  initRoutes() {
    this.server.use("/api", userRouter);
  }

  startListening() {
    this.server.listen(3000, () => {
      console.log("Start listening on port 3000");
    });
  }
};
