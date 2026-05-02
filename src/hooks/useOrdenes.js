import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';

export const useOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setOrdenes([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, 'ordenes'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setOrdenes(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error al obtener órdenes:", err);
        setError("Error al cargar órdenes");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // 🔥 Crear orden
  const addOrden = async (ordenData) => {
    if (!currentUser) throw new Error("Usuario no autenticado");

    try {
      const ticket = "T-" + Date.now();

      await addDoc(collection(db, 'ordenes'), {
        ...ordenData,
        ticket,
        estado: "recibida",
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      });

    } catch (err) {
      console.error("Error al crear orden:", err);
      throw err;
    }
  };

  // 🔥 Cambiar estado
  const updateEstado = async (id, estado) => {
    try {
      const ordenRef = doc(db, 'ordenes', id);
      await updateDoc(ordenRef, { estado });
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      throw err;
    }
  };

  // 🔥 FILTRO CLAVE DEL PROYECTO
  const ordenesListas = ordenes.filter(
    (o) => o.estado === "lista"
  );

  return {
    ordenes,
    loading,
    error,
    addOrden,
    updateEstado,
    ordenesListas
  };
};