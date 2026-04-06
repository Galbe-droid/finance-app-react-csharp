import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import type React from "react";
import { useAuth } from "../auth/AuthContext";

interface Props {
    children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = ({children}) => {
    const { isAuthenticated } = useAuth();
    if(!isAuthenticated) {
        return <Navigate to="/"/>
    }

    return children;    
}


export default PrivateRoute;