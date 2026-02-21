import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useStore from '../../store/useStore';
import { ROLE_PERMISSIONS } from '../../utils/constants';

const RoleGuard = ({ children, requiredPermission }) => {
    const { user, isAuthenticated } = useStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredPermission) {
        const userPermissions = ROLE_PERMISSIONS[user.role] || [];
        if (!userPermissions.includes(requiredPermission)) {
            // Re-direct to dashboard or show unauthorized
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default RoleGuard;
