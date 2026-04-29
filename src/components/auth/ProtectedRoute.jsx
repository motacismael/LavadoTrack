import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // Opcional: Podrías añadir aquí la comprobación de "loading" desde AuthContext
  // si el AuthProvider pasara ese estado, para mostrar un spinner mientras verifica.
  
  if (!currentUser) {
    // Si no hay usuario, redirigimos a la página de login
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, renderizamos el componente hijo
  return children;
};

export default ProtectedRoute;
