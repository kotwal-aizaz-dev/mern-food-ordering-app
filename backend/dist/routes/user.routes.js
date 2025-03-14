"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// /api/my/user
router.get("/", auth_1.jwtCheck, auth_1.jwtParse, user_controller_1.getCurrentUser);
router.post("/", auth_1.jwtCheck, user_controller_1.createCurrentUser);
router.put("/", auth_1.jwtCheck, auth_1.jwtParse, validation_1.validateUserRequest, user_controller_1.updateCurrentUser);
exports.default = router;
