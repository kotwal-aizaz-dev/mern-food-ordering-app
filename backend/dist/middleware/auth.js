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
exports.jwtParse = exports.jwtCheck = void 0;
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Middleware to verify JWT tokens using Auth0
// This checks if the token is valid and was issued by our Auth0 domain
exports.jwtCheck = (0, express_oauth2_jwt_bearer_1.auth)({
    // The API identifier in Auth0
    audience: process.env.AUTH0_AUDIENCE,
    // The URL of your Auth0 tenant domain
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    // The signing algorithm used for the token
    tokenSigningAlg: "RS256",
});
const jwtParse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the Authorization header from the request
    const { authorization } = req.headers;
    // Check if Authorization header exists and starts with "Bearer"
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.sendStatus(401);
    }
    // Extract the token from the Authorization header
    // Format: "Bearer <token>"
    const token = authorization.split(" ")[1];
    try {
        // Decode the JWT token (without verification)
        const decoded = jsonwebtoken_1.default.decode(token);
        // Extract the Auth0 user ID from the 'sub' claim
        const auth0Id = decoded.sub;
        // Find the user in our database using the Auth0 ID
        const user = yield user_model_1.default.findOne({ auth0Id });
        // If user doesn't exist in our database, return unauthorized
        if (!user) {
            return res.sendStatus(401);
        }
        // Attach user information to the request object for use in subsequent middleware
        req.auth0Id = auth0Id;
        req.userId = user._id.toString();
        next();
    }
    catch (error) {
        // If token decoding fails, return unauthorized
        return res.sendStatus(401);
    }
});
exports.jwtParse = jwtParse;
