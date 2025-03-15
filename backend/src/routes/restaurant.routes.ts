import { Router } from "express";
import multer from "multer";
import {
  createRestaurant,
  getRestaurant,
} from "../controllers/restaurant.controller";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateRestaurantRequest } from "../middleware/requests.validation";

const router = Router();

// setup multer middleware
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.get("/", jwtCheck, jwtParse as any, getRestaurant as any);
router.post(
  "/",
  upload.single("imageFile"),
  validateRestaurantRequest as any,
  //   jwtCheck,
  //   jwtParse as any,
  createRestaurant as any
);

export default router;
