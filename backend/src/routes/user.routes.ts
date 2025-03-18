import express from "express";
import {getCurrentUser,createCurrentUser,updateCurrentUser} from "../controllers/user.controller";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateUserRequest } from "../middleware/requests.validation";


const router = express.Router();

// /api/my/user
router.get("/", jwtCheck, jwtParse, getCurrentUser );
router.post("/", jwtCheck, createCurrentUser);
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateUserRequest,
  updateCurrentUser
);

export default router;
