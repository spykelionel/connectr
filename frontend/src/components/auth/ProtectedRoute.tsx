import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../../store";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { access_token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!access_token) {
    // Redirect to login page with return url
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
