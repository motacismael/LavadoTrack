// import { createContext, useContext, useEffect, useState } from 'react';
// import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
// import { auth } from '@/firebase/config';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth debe ser usado dentro de un AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const login = (email, password) => {
//     return signInWithEmailAndPassword(auth, email, password);
//   };

//   const logout = () => {
//     return signOut(auth);
//   };

//   const register = (email, password) => {
//     return createUserWithEmailAndPassword(auth, email, password);
//   };

//   const value = {
//     currentUser,
//     login,
//     register,
//     logout,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase/supabaseClient'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Obtener sesión actual
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // Login
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  // Registro
  const register = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) throw error
    return data
  }

  // Logout
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)