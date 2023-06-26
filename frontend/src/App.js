import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TacticsPage from "./pages/TacticsPage/TacticsPage.jsx";
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";

function App(props) {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/tactics" element={<TacticsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;