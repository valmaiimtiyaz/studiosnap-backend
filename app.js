const express = require("express");
const cors = require("cors");
const snapRoutes = require("./routes/snapRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", snapRoutes);

module.exports = app; 