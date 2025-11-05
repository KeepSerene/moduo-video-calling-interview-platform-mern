import { Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";

export default function PublicRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  return isSignedIn ? <Navigate to="/dashboard" /> : children;
}
