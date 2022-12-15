import { useContext } from 'react';
import UserContext from '../contexts/UserContext';
// eslint-disable-next-line
import { Navigate } from "react-router-dom";
import { GetDebugLvl } from '../config/Entorno'

const DebugLvl = GetDebugLvl()

export const ProtectedRoute = ({ children }) => {
    const { userCtx } = useContext(UserContext)
    if (userCtx?.account === null) {
        if (DebugLvl >= 2){console.log("ProtectedRoute: User Not Logged In")}
        return <Navigate to="/" />;
    }
    return children;
};