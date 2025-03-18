import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { createCheckoutSession, stripeWebhookHandler } from "../controllers/order.controller";
const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse as any,
  createCheckoutSession as any
);

router.post("/checkout/webhook", stripeWebhookHandler )
export default router