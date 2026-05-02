import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ClienteList from './components/clientes/ClienteList';
import ProtectedRoute from './components/auth/ProtectedRoute';

// MÓDULO ÓRDENES
import OrdenForm from './components/ordenes/OrdenForm';
import OrdenList from './components/ordenes/OrdenList';

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* HEADER */}
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <h1 className="text-2xl font-bold text-blue-600">
            LavadoTrack
          </h1>

          {currentUser && (
            <div className="flex items-center gap-6">

              {/* NAVEGACIÓN */}
              <nav className="flex gap-4 text-sm">
                <Link to="/" className="text-blue-500 hover:underline">
                  Inicio
                </Link>

                <Link to="/clientes" className="text-blue-500 hover:underline">
                  Clientes
                </Link>

                <Link to="/ordenes" className="text-blue-500 hover:underline">
                  Órdenes
                </Link>
              </nav>

              {/* USUARIO */}
              <div className="text-gray-600 text-sm">
                {currentUser.email}
              </div>

            </div>
          )}
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">

        <Routes>

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              currentUser
                ? <Navigate to="/" replace />
                : <LoginForm />
            }
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={
              currentUser
                ? <Navigate to="/" replace />
                : <RegisterForm />
            }
          />

          {/* 🔥 HOME (PANTALLA PRINCIPAL) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="grid gap-4 text-center">

                  <h2 className="text-2xl font-bold">
                    Panel Principal
                  </h2>

                  <div className="flex justify-center gap-6 mt-6">

                    <Link
                      to="/clientes"
                      className="bg-blue-500 text-white px-6 py-3 rounded"
                    >
                      Clientes
                    </Link>

                    <Link
                      to="/ordenes"
                      className="bg-green-500 text-white px-6 py-3 rounded"
                    >
                      Órdenes
                    </Link>

                  </div>

                </div>
              </ProtectedRoute>
            }
          />

          {/* CLIENTES */}
          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <ClienteList />
              </ProtectedRoute>
            }
          />

          {/* ÓRDENES */}
          <Route
            path="/ordenes"
            element={
              <ProtectedRoute>
                <div className="w-full space-y-6">
                  <OrdenForm />
                  <OrdenList />
                </div>
              </ProtectedRoute>
            }
          />

        </Routes>

      </main>
    </div>
  );
}

export default App;