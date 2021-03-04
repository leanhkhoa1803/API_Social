const express = require("express");
const app = express();
const errorMiddleware = require("./Middleware/errorMiddleware");
const dotenv = require("dotenv");
const { ConnectMongo } = require("./database/connectDB");
const auth = require("./routes/api/auth");
const user = require("./routes/api/user");

dotenv.config();
app.use(express.json());
//ket noi db
ConnectMongo.getConnect();
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);
app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
  console.log(`Server is running port ${process.env.PORT}`);
});
