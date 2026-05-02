const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

module.exports = app;