import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout>Home</Layout>} />
      <Route path="/user-profile" element={<span>User Profile</span>} />
      <Route path="*" element={<Navigate to={"/"} />} /> //?catch all route to redirect all the unknown urls to home. 
    </Routes>
  );
};

export default AppRoutes;
