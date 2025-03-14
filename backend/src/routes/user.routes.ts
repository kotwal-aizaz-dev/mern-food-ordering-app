import express from "express";
import {getCurrentUser,createCurrentUser,updateCurrentUser} from "../controllers/user.controller";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateUserRequest } from "../middleware/validation";


const router = express.Router();

// /api/my/user
router.get("/", jwtCheck, jwtParse as any, getCurrentUser as any);
router.post("/", jwtCheck, createCurrentUser as any);
router.put(
  "/",
  jwtCheck,
  jwtParse as any,
  validateUserRequest as any,
  updateCurrentUser as any
);

export default router;
