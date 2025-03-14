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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCurrentUser = exports.createCurrentUser = exports.getCurrentUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
// Retrieve the current user's information from the database
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find user by ID stored in request object (set by auth middleware)
        const currentUser = yield user_model_1.default.findOne({ _id: req.userId });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(currentUser);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getCurrentUser = getCurrentUser;
// Create a new user or handle existing user from Auth0 authentication
const createCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auth0Id } = req.body;
        // Check if user already exists with the given Auth0 ID
        const existingUser = yield user_model_1.default.findOne({ auth0Id });
        // If user exists, return success without creating new user
        if (existingUser) {
            return res.status(200).send();
        }
        // Create and save new user with data from request body
        const newUser = new user_model_1.default(req.body);
        yield newUser.save();
        res.status(201).json(newUser.toObject());
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
    }
});
exports.createCurrentUser = createCurrentUser;
// Update the current user's profile information
const updateCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, addressLine1, country, city } = req.body;
        // Validate that all required fields are provided
        if (!name || !addressLine1 || !country || !city) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Find user by ID from request object
        const user = yield user_model_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Update user fields with new information
        user.name = name;
        user.addressLine1 = addressLine1;
        user.city = city;
        user.country = country;
        // Save updated user information
        yield user.save();
        return res.status(200).json(user.toObject());
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating user" });
    }
});
exports.updateCurrentUser = updateCurrentUser;
