// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';

// const errorMessages = {
//   'auth/email-already-in-use': 'Este correo ya está registrado.',
//   'auth/invalid-email': 'El formato del correo es inválido.',
//   'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
//   'default': 'Ocurrió un error al registrarse. Inténtalo de nuevo.'
// };

// export const RegisterForm = () => {
//   const { register } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!email || !password || !confirmPassword) {
//       setError('Por favor, completa todos los campos.');
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError('Las contraseñas no coinciden.');
//       return;
//     }

//     setLoading(true);
//     try {
//       await register(email, password);
//       // Redirección manejada por el router o el estado global si es exitoso
//     } catch (err) {
//       console.error(err);
//       const message = errorMessages[err.code] || errorMessages['default'];
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
//       <div className="text-center">
//         <h2 className="text-3xl font-extrabold text-gray-900">LavadoTrack</h2>
//         <p className="mt-2 text-sm text-gray-600">Crea una cuenta nueva</p>
//       </div>

//       <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//         {error && (
//           <div role="alert" className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
//             {error}
//           </div>
//         )}

//         <div className="space-y-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Correo Electrónico
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="tu@correo.com"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Contraseña
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               autoComplete="new-password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="••••••••"
//             />
//           </div>

//           <div>
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//               Confirmar Contraseña
//             </label>
//             <input
//               id="confirmPassword"
//               name="confirmPassword"
//               type="password"
//               autoComplete="new-password"
//               required
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="••••••••"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {loading ? 'Registrando...' : 'Registrarse'}
//         </button>

//         <div className="text-center mt-4">
//           <p className="text-sm text-gray-600">
//             ¿Ya tienes cuenta?{' '}
//             <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
//               Inicia sesión aquí
//             </Link>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const errorMessages = {
  'User already registered': 'Este correo ya está registrado.',
  'Invalid email': 'El formato del correo es inválido.',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  'default': 'Ocurrió un error al registrarse. Inténtalo de nuevo.'
}

export const RegisterForm = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      await register(email, password)

      // 👇 Puedes cambiar esto dependiendo de tu config
      alert('Usuario creado correctamente')
      navigate('/login')

    } catch (err) {
      console.error(err)
      const message = errorMessages[err.message] || errorMessages['default']
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">LavadoTrack</h2>
        <p className="mt-2 text-sm text-gray-600">Crea una cuenta nueva</p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 text-white bg-green-600 rounded"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <p className="text-sm text-center">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterForm