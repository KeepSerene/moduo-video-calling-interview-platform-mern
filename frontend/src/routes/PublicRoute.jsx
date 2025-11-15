import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";

export default function PublicRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  return isSignedIn ? <Navigate to="/dashboard" replace /> : children;
}
