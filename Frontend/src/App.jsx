import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import HomePage from "./components/HomePage";
import "./App.css";
import MoodScorePage from "./components/MoodScorePage";
import SettingsPage from "./components/Settings";
import UserContextProvider from "./components/UserContextProvider";

const App = () => {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/mood" element={<MoodScorePage />} />
        </Routes>
      </Router>
    </UserContextProvider>
  );
};

export default App;
