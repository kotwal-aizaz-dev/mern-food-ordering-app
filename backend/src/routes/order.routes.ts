import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { createCheckoutSession } from "../controllers/order.controller";
const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse as any,
  createCheckoutSession as any
);

export default router