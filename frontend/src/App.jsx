import { Routes, Route } from "react-router";
import { ProtectedRoute, PublicRoute } from "./routes";
import {
  DashboardPage,
  HomePage,
  ProblemDetailsPage,
  ProblemsPage,
  SessionPage,
} from "./pages";
import { Toaster } from "react-hot-toast";

const App = () => (
  <>
    <Routes>
      <Route
        index
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/problems"
        element={
          <ProtectedRoute>
            <ProblemsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/problems/:problemId"
        element={
          <ProtectedRoute>
            <ProblemDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sessions/:sessionId"
        element={
          <ProtectedRoute>
            <SessionPage />
          </ProtectedRoute>
        }
      />
    </Routes>

    <Toaster toastOptions={{ duration: 3000 }} />
  </>
);

export default App;
