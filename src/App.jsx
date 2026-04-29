import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ClienteList from './components/clientes/ClienteList';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">LavadoTrack</h1>
          {currentUser && (
            <div className="text-sm text-gray-600">
              {currentUser.email}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Routes>
          <Route path="/login" element={
            currentUser ? <Navigate to="/clientes" replace /> : <LoginForm />
          } />
          <Route path="/register" element={
            currentUser ? <Navigate to="/clientes" replace /> : <RegisterForm />
          } />
          <Route path="/clientes" element={
            <ProtectedRoute>
              <div className="w-full">
                <ClienteList />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/clientes" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
