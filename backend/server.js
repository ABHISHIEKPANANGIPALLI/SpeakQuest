const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
app.use(cors());

connectDB();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("SpeakQuest Backend Running");
});

app.listen(5000, () => {
  console.log("Server Running");
});