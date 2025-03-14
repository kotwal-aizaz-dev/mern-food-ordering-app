import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import HomePage from "./components/pages/HomePage";
import AuthCallbackPage from "./components/pages/AuthCallbackPage";
import UserProfilePage from "./components/pages/UserProfilePage";
import ProtectedRoute from "./auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Route for the home page */}
      <Route
        path="/"
        element={
          <Layout showHero>
            <HomePage />
          </Layout>
        }
      />
      {/* Route for the authentication callback page */}
      <Route path="/auth-callback" element={<AuthCallbackPage />} />
      {/* Protected route for user profile page */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/user-profile"
          element={
            <Layout>
              <UserProfilePage />
            </Layout>
          }
        />
      </Route>
      {/* Catch-all route to redirect unknown URLs to home */}
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
};

export default AppRoutes;
