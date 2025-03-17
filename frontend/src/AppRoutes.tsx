import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import HomePage from "./components/pages/HomePage";
import AuthCallbackPage from "./components/pages/AuthCallbackPage";
import UserProfilePage from "./components/pages/UserProfilePage";
import ProtectedRoute from "./auth/ProtectedRoute";
import ManageRestaurantPage from "./components/pages/ManageRestaurantPage";
import SearchPage from "./components/pages/SearchPage";
import DetailPage from "./components/pages/DetailPage";

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
        <Route
          path="/manage-restaurant"
          element={
            <Layout>
              <ManageRestaurantPage />
            </Layout>
          }
        />
        <Route
          path="/restaurant/:restaurantId"
          element={
            <Layout>
              <DetailPage />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/search/:city"
        element={
          <Layout showHero={false}>
            <SearchPage />
          </Layout>
        }
      />
      {/* Catch-all route to redirect unknown URLs to home */}
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
};

export default AppRoutes;
