const authRouter = require("./auth");
const chatRouter = require("./chat");
const userRouter = require("./user");
const messageRouter = require("./message");

const initRoutes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/chats", chatRouter);
  app.use("/api/users", userRouter);
  app.use("/api/messages", messageRouter);
};
module.exports = initRoutes;
