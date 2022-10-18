import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, session, signedIn }: ProtectedRouteProps) => {

    if (!signedIn || !session) {
      // user is not authenticated
      return <Navigate to="/" />;
    }
    return <>{children}</>
  };

export default ProtectedRoute