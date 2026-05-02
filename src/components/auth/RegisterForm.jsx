import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const errorMessages = {
  'auth/email-already-in-use': 'Este correo ya está registrado.',
  'auth/invalid-email': 'El formato del correo es inválido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'default': 'Ocurrió un error al registrarse. Inténtalo de nuevo.'
};

const RegisterForm = () => {
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log("👉 Register clicked");
    console.log("register function:", register);

    if (!email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      console.log("👉 Enviando a Firebase...");

      const result = await register(email, password);

      console.log("👉 Registro exitoso:", result);

      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (err) {
      console.log("🔥 FIREBASE ERROR CODE:", err?.code);
      console.log("🔥 FIREBASE ERROR MESSAGE:", err?.message);

      const message = errorMessages[err?.code] || err?.message || errorMessages.default;
      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">

      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          LavadoTrack
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Crea una cuenta nueva
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

        {error && (
          <div role="alert" className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <p className="text-center text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600">
            Inicia sesión
          </Link>
        </p>

      </form>
    </div>
  );
};

export default RegisterForm;