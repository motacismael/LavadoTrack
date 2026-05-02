import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import { auth } from "@/firebase/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 REGISTRO
  const register = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // 🔥 LOGIN
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // 🔥 LOGOUT
  const logout = async () => {
    return await signOut(auth);
  };

  // 🔥 DETECTAR USUARIO LOGUEADO
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        register,
        login,
        logout
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);