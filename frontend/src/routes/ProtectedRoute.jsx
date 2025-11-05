import { Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  return isSignedIn ? children : <Navigate to="/" />;
}
