import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
	const { token } = useSelector(state => state.auth)
	if (!token) {
		return <Navigate to={`/`} replace />;
	}
	return <Outlet />
}

export default ProtectedRoute