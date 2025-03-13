import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import HomePage from "./components/pages/HomePage";
import AuthCallbackPage from "./components/pages/AuthCallbackPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage/></Layout>} />
      <Route path="/auth-callback" element={<AuthCallbackPage/>}/>
      <Route path="/user-profile" element={<span>User Profile</span>} />
      <Route path="*" element={<Navigate to={"/"} />} /> //?catch all route to redirect all the unknown urls to home. 
    </Routes>
  );
};

export default AppRoutes;
