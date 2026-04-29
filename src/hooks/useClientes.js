import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';

export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setClientes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'clientes'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const clientesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClientes(clientesData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error al obtener clientes:", err);
        setError("Error al cargar los clientes.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const addCliente = async (clienteData) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      const docRef = await addDoc(collection(db, 'clientes'), {
        ...clienteData,
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      });
      return docRef;
    } catch (err) {
      console.error("Error al añadir cliente:", err);
      throw err;
    }
  };

  const updateCliente = async (id, updatedData) => {
    try {
      const clienteRef = doc(db, 'clientes', id);
      await updateDoc(clienteRef, updatedData);
    } catch (err) {
      console.error("Error al actualizar cliente:", err);
      throw err;
    }
  };

  const deleteCliente = async (id) => {
    try {
      const clienteRef = doc(db, 'clientes', id);
      await deleteDoc(clienteRef);
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      throw err;
    }
  };

  return {
    clientes,
    loading,
    error,
    addCliente,
    updateCliente,
    deleteCliente
  };
};
