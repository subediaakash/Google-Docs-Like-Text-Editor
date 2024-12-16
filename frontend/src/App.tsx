import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SignUpPage } from "./pages/SignupPage";
import { SignInPage } from "./pages/SignInPage";
import CollaborativeEditor from "./components/collaborative-editor";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/" element={<CollaborativeEditor />} />
      </Routes>
    </Router>
  );
};

export default App;
