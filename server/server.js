const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./src/configs/connectDB");
const initRoutes = require("./src/routes");

require("dotenv").config();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: process.env.CLIENT_URL,
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

connectDB();
initRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
