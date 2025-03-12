import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRouter from "./routes/user.routes";
import { createUser } from "./controllers/user.controller";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("connected to database!");
});
const app = express();
app.use(express.json()); //? automatically converts body of any request made to the server into JSON.
app.use(cors());
app.use("/health", async (req: Request, res: Response) => {
  res.send({ message: "Health OK!" });
});
app.use("/api/user", userRouter);

app.listen(7000, () => {
  console.log("Server started on localhost:7000");
});
