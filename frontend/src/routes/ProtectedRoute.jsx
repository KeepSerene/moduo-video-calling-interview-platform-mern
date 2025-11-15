import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  return isSignedIn ? children : <Navigate to="/" replace />;
}
