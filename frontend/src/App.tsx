import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { SignUpPage } from "./pages/signup-page";
import { SignInPage } from "./pages/signIn-page";
import CollaborativeEditor from "./components/collaborative-editor";
import GetDocumentsPage from "./pages/hero-document-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GetDocumentById from "./components/get-documentById";
import NewDocument from "./components/create-new-document";
import { ProtectedRoute } from "./components/protected-route";

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CollaborativeEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <GetDocumentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document/:id"
            element={
              <ProtectedRoute>
                <GetDocumentById />
              </ProtectedRoute>
            }
          />

          <Route
            path="/new"
            element={
              <ProtectedRoute>
                <NewDocument />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
