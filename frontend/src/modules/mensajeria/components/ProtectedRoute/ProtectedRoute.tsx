import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('access_token');

  // Si NO hay token, redirigir al Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si HAY token, renderizar el contenido protegido (Outlet)
  return <Outlet />;
};