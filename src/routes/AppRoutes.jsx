import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import RoleGuard from '../components/auth/RoleGuard';

import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import VehicleRegistry from '../pages/VehicleRegistry';
import TripDispatcher from '../pages/TripDispatcher';
import Maintenance from '../pages/Maintenance';
import Drivers from '../pages/Drivers';
import Expenses from '../pages/Expenses';
import Analytics from '../pages/Analytics';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
                <RoleGuard>
                    <DashboardLayout />
                </RoleGuard>
            }>
                <Route index element={<Dashboard />} />

                <Route path="vehicles" element={
                    <RoleGuard requiredPermission="vehicles">
                        <VehicleRegistry />
                    </RoleGuard>
                } />

                <Route path="trips" element={
                    <RoleGuard requiredPermission="trips">
                        <TripDispatcher />
                    </RoleGuard>
                } />

                <Route path="maintenance" element={
                    <RoleGuard requiredPermission="maintenance">
                        <Maintenance />
                    </RoleGuard>
                } />

                <Route path="expenses" element={
                    <RoleGuard requiredPermission="expenses">
                        <Expenses />
                    </RoleGuard>
                } />

                <Route path="drivers" element={
                    <RoleGuard requiredPermission="drivers">
                        <Drivers />
                    </RoleGuard>
                } />

                <Route path="analytics" element={
                    <RoleGuard requiredPermission="analytics">
                        <Analytics />
                    </RoleGuard>
                } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
