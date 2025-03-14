import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

// Middleware function to handle validation errors
// Checks if there are any validation errors and returns them as a response
// If no errors, passes control to the next middleware
const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Array of validation middlewares for user request validation
// Each validation checks a specific field in the request body
export const validateUserRequest = [
  // Validates that name is a non-empty string
  body("name").isString().notEmpty().withMessage("Name must be a string"),
  
  // Validates that addressLine1 is a non-empty string
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("Addressline 1 must be a string"),
  
  // Validates that city is a non-empty string
  body("city").isString().notEmpty().withMessage("City must be a string"),
  
  // Validates that country is a non-empty string
  body("country").isString().notEmpty().withMessage("Country must be a string"),
  
  // Finally, handles any validation errors that occurred
  handleValidationErrors,
];
