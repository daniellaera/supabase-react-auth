import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, signedIn }: ProtectedRouteProps) => {

    if (!signedIn) {
      // user is not authenticated
      return <Navigate to="/" />;
    }
    return <>{children}</>
  };

export default ProtectedRoute