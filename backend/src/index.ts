import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import userRouter from "./routes/user.routes";
import restaurantRouter from "./routes/restaurant.routes";
import OrderRouter from "./routes/order.routes";
// import { createUser } from "./controllers/user.controller";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("connected to database!");
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
app.use(cors());
app.use("/health", async (req: Request, res: Response) => {
  res.send({ message: "Health OK!" });
});
app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));
// stripe needs the raw data and as we are converting every request to JSON we need to explicitly convert the data to raw.
app.use(express.json()); //? automatically converts body of any request made to the server into JSON.

app.use("/api/user", userRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/order", OrderRouter);

app.listen(7000, () => {
  console.log("Server started on localhost:7000");
});
