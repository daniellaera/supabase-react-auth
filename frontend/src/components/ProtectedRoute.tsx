import { ReactNode, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabaseClient } from "../config/supabase-client";

const ProtectedRoute = ({ children }: {children: ReactNode}) => {
  const session = supabaseClient.auth.session()
  const [signedIn, setSignedIn] = useState(true);

  supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log(event, session)
      if (event === 'SIGNED_OUT') {
        setSignedIn(false)
      } 
  })

    if (!signedIn || !session) {
      // user is not authenticated
      return <Navigate to="/" />;
    }
    return <>{children}</>
  };

export default ProtectedRoute