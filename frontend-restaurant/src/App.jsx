/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserApp from "./user/UserApp";   // User-side Application
import AdminApp from "./admin/AdminApp"; // Admin-side Application
import NotFound from "./NotFound"; // 404 Page (Optional)

function App() {
  return (
    <Router>
      <Routes>
        {/* User Side Routes */}
        <Route path="/*" element={<UserApp />} />

        {/* Admin Panel Routes */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* 404 Page for undefined routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
