import { auth } from "express-oauth2-jwt-bearer";

// a built in method from auth0 to validate the jwt token 
export const jwtCheck = auth({
  audience : process.env.AUTH0_AUDIENCE,
  issuerBaseURL : process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg : "RS256"
});
