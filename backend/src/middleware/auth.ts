import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

// Middleware to verify JWT tokens using Auth0
// This checks if the token is valid and was issued by our Auth0 domain
export const jwtCheck = auth({
  // The API identifier in Auth0
  audience: process.env.AUTH0_AUDIENCE,
  // The URL of your Auth0 tenant domain
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  // The signing algorithm used for the token
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract the Authorization header from the request
  const { authorization } = req.headers;

  // Check if Authorization header exists and starts with "Bearer"
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.sendStatus(401);
  } else {
    // Extract the token from the Authorization header
    // Format: "Bearer <token>"
    const token = authorization.split(" ")[1];

    try {
      // Decode the JWT token (without verification)
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      // Extract the Auth0 user ID from the 'sub' claim
      const auth0Id = decoded.sub;

      // Find the user in our database using the Auth0 ID
      const user = await User.findOne({ auth0Id });

      // If user doesn't exist in our database, return unauthorized
      if (!user) {
        res.sendStatus(401);
      } else {
        // Attach user information to the request object for use in subsequent middleware
        req.auth0Id = auth0Id as string;
        req.userId = user._id.toString();
      }
      next();
    } catch (error) {
      // If token decoding fails, return unauthorized
      res.sendStatus(401);
    }
  }
};
