import { createBrowserRouter } from "react-router";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import {
  DashboardPage,
  ErrorPage,
  HomePage,
  ProblemDetailsPage,
  ProblemsPage,
  SessionPage,
} from "../pages";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />, // root error boundary catches all errors
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "problems",
        element: (
          <ProtectedRoute>
            <ProblemsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "problems/:problemId",
        element: (
          <ProtectedRoute>
            <ProblemDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "sessions/:sessionId",
        element: (
          <ProtectedRoute>
            <SessionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <ErrorPage />, // catch-all for 404s
      },
    ],
  },
]);

export default router;
