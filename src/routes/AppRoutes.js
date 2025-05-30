// src/routes/AppRoutes.js
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ReportIssue from "../pages/ReportIssue";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import NotFound from "../pages/NotFound";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/report-issue" element={<ReportIssue />} />
    <Route path="/user-dashboard" element={<UserDashboard />} />
    <Route path="/admin-dashboard" element={<AdminDashboard />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
