import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const jwt = localStorage.getItem("JWT");

            if (!jwt) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/validate-token`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });


                if (res.data.valid) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem("JWT");
                    setIsAuthenticated(false);
                }
            } catch (e) {
                console.error("Token validation failed:", e);
                localStorage.removeItem("JWT");
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        
        return <div>Loading...</div>; 
    }

    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
