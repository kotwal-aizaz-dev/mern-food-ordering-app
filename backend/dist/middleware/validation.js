"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserRequest = void 0;
const express_validator_1 = require("express-validator");
// Middleware function to handle validation errors
// Checks if there are any validation errors and returns them as a response
// If no errors, passes control to the next middleware
const handleValidationErrors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
});
// Array of validation middlewares for user request validation
// Each validation checks a specific field in the request body
exports.validateUserRequest = [
    // Validates that name is a non-empty string
    (0, express_validator_1.body)("name").isString().notEmpty().withMessage("Name must be a string"),
    // Validates that addressLine1 is a non-empty string
    (0, express_validator_1.body)("addressLine1")
        .isString()
        .notEmpty()
        .withMessage("Addressline 1 must be a string"),
    // Validates that city is a non-empty string
    (0, express_validator_1.body)("city").isString().notEmpty().withMessage("City must be a string"),
    // Validates that country is a non-empty string
    (0, express_validator_1.body)("country").isString().notEmpty().withMessage("Country must be a string"),
    // Finally, handles any validation errors that occurred
    handleValidationErrors,
];
