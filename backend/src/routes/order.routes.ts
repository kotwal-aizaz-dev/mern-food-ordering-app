import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import {
  createCheckoutSession,
  getOrdersByUserId,
  stripeWebhookHandler,
} from "../controllers/order.controller";
const router = express.Router();

router.get("/", jwtCheck, jwtParse, getOrdersByUserId);

router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  createCheckoutSession as any
);

router.post("/checkout/webhook", stripeWebhookHandler);

export default router;
