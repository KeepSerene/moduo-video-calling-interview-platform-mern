import { Routes, Route } from "react-router";
import { ProtectedRoute, PublicRoute } from "./routes";
import { DashboardPage, HomePage, ProblemsPage } from "./pages";
import { Toaster } from "react-hot-toast";

function App() {
  return (
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
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
