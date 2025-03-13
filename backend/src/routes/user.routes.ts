import { Router } from "express";
import { createUser, updateUser } from "../controllers/user.controller";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateUserRequest } from "../middleware/Validation";
const userRouter = Router();

userRouter.post("/", jwtCheck, createUser as any);
userRouter.put(
  "/",
  jwtCheck,
  jwtParse as any,
  validateUserRequest as any,
  updateUser as any
);
export default userRouter;
