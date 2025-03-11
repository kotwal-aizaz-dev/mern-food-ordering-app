import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("connected to database!")
})
const app = express();
app.use(express.json()); //? automatically converts body of any request made to the server into JSON.
app.use(cors());

app.get("/test", async (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

app.listen(7000, () => {
  console.log("Server started on localhost:7000");
});
