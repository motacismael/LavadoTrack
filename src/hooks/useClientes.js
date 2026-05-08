import { useState, useEffect } from "react";
import { supabase } from "@/supabase/config";
import { useAuth } from "@/context/AuthContext";

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

    const fetchClientes = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("clientes")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError("Error al cargar los clientes.");
      } else {
        setClientes((data || []).map((r) => ({ ...r, createdAt: r.created_at })));
        setError(null);
      }
      setLoading(false);
    };

    fetchClientes();
  }, [currentUser]);

  const addCliente = async (clienteData) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    const { data, error: insertError } = await supabase
      .from("clientes")
      .insert({ ...clienteData, user_id: currentUser.id })
      .select()
      .single();
    if (insertError) throw insertError;
    // Actualiza el estado local directamente
    const nuevo = { ...data, createdAt: data.created_at };
    setClientes((prev) => [nuevo, ...prev]);
    return data;
  };

  const updateCliente = async (id, updatedData) => {
    const { error: updateError } = await supabase
      .from("clientes")
      .update(updatedData)
      .eq("id", id);
    if (updateError) throw updateError;
    // Actualiza el estado local directamente
    setClientes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
  };

  const deleteCliente = async (id) => {
    const { error: deleteError } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id);
    if (deleteError) throw deleteError;
    // Actualiza el estado local directamente
    setClientes((prev) => prev.filter((c) => c.id !== id));
  };

  return { clientes, loading, error, addCliente, updateCliente, deleteCliente };
};