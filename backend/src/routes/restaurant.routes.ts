import { Router } from "express";
import multer from "multer";
import {
  createRestaurant,
  getRestaurant,
  getRestaurants,
  updateRestaurant,
} from "../controllers/restaurant.controller";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateRestaurantRequest } from "../middleware/requests.validation";
import { param } from "express-validator";

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
router.put(
  "/",
  upload.single("imageFile"),
  validateRestaurantRequest as any,
  jwtCheck,
  jwtParse as any,
  updateRestaurant as any
);

router.get("/search/:city" , param("city").isString().trim().notEmpty().withMessage("City parameter must be a valid string"),
getRestaurants as any
)
export default router;
