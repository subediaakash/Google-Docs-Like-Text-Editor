import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SignUpPage } from "./pages/signup-page";
import { SignInPage } from "./pages/signIn-page";
import CollaborativeEditor from "./components/collaborative-editor";
import GetDocumentsPage from "./pages/hero-document-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GetDocumentById from "./components/get-documentById";
import Tiptap from "./components/TipTap";

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/" element={<CollaborativeEditor />} />
          <Route path="/documents" element={<GetDocumentsPage />} />
          <Route path="/document/:id" element={<GetDocumentById />} />
          <Route path="/temp" element={<Tiptap />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
