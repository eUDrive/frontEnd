import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка...</div>;
  }

  console.log('Current user:', user);
  console.log('User role:', user?.role);

  // Если не аутентифицирован ИЛИ роль не 'Admin'
  if (!isAuthenticated || user?.role !== 'Admin') {
    return <Navigate to="*" replace />;
  }

  return <>{children}</>;
}