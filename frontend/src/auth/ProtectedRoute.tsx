import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Get the authentication state from Auth0
  const { isAuthenticated } = useAuth0();

  // If the user is authenticated, render the child routes (Outlet)
  // Otherwise, navigate to the home page
  return isAuthenticated ? <Outlet /> : <Navigate to={"/"} replace />; // When replace is true, the navigation will replace the current entry in the history stack instead of adding a new one.
};

export default ProtectedRoute;

/**
 * Use replace when redirecting after login/logout to prevent users from navigating back to the previous page using the browser's back button.
Useful in authentication flows where navigating back should not take the user to a restricted page.
 */