import express from "express";
import { readdirSync } from "fs";
import cors from "cors";
import mongoose from "mongoose";
const morgan = require("morgan");
require("dotenv").config();

const app = express();

//db connection
console.log(process.env.DATABASE)
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB connection Err: ", err));

app.use(cors());
app.use(morgan("dev"));

readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
