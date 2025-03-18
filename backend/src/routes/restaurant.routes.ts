import { Router } from "express";
import multer from "multer";
import {
  createRestaurant,
  getRestaurant,
  getRestaurantById,
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

router.get("/", jwtCheck, jwtParse, getRestaurant);
router.post(
  "/",
  upload.single("imageFile"),
  validateRestaurantRequest,
  //   jwtCheck,
  //   jwtParse as any,
  createRestaurant
);
router.put(
  "/",
  upload.single("imageFile"),
  validateRestaurantRequest,
  jwtCheck,
  jwtParse,
  updateRestaurant
);

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string"),
  getRestaurants as any
);

router.get(
  "/:restaurantId",
  param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("restaurantId parameter must be a valid string"),
    getRestaurantById
);
export default router;
