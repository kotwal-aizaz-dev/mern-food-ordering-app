import { Router } from "express";
import { createUser } from "../controllers/user.controller";
import { jwtCheck } from "../middleware/auth";
const userRouter = Router();

userRouter.post("/", jwtCheck, createUser as any);

export default userRouter;
