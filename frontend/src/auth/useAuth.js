import { useContext } from "react";
import { AuthContext } from "./AuthContext";

/**
 * Custom hook to access authentication context.
 * Usage: const auth = useAuth();
 */
export default function useAuth() {
  return useContext(AuthContext);
}