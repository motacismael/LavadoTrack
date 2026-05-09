import { useState, useEffect } from "react";
import { supabase } from "@/supabase/config";
import { useAuth } from "@/context/AuthContext";

export const useOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setOrdenes([]);
      setLoading(false);
      return;
    }

    const init = async () => {
      // Verificar si es admin
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("is_admin")
        .eq("id", currentUser.id)
        .single();

      const admin = perfil?.is_admin || false;
      setIsAdmin(admin);

      // Fetch órdenes
      setLoading(true);
      const query = supabase
        .from("ordenes")
        .select("*")
        .order("created_at", { ascending: false });

      // Si no es admin, filtrar por usuario
      if (!admin) query.eq("user_id", currentUser.id);

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError("Error al cargar órdenes");
      } else {
        setOrdenes((data || []).map((r) => ({ ...r, createdAt: r.created_at })));
        setError(null);
      }
      setLoading(false);
    };

    init();
  }, [currentUser]);

  const addOrden = async (ordenData) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    const ticket = "T-" + Date.now();
    const { data, error: insertError } = await supabase
      .from("ordenes")
      .insert({
        ...ordenData,
        ticket,
        estado: "recibida",
        user_id: currentUser.id,
      })
      .select()
      .single();
    if (insertError) throw insertError;
    const nueva = { ...data, createdAt: data.created_at };
    setOrdenes((prev) => [nueva, ...prev]);
  };

  const updateEstado = async (id, estado) => {
    const { error: updateError } = await supabase
      .from("ordenes")
      .update({ estado })
      .eq("id", id);
    if (updateError) throw updateError;
    setOrdenes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, estado } : o))
    );
  };

  const deleteOrden = async (id) => {
    const { error: deleteError } = await supabase
      .from("ordenes")
      .delete()
      .eq("id", id);
    if (deleteError) throw deleteError;
    setOrdenes((prev) => prev.filter((o) => o.id !== id));
  };

  const ordenesListas = ordenes.filter((o) => o.estado === "lista");

  return { ordenes, loading, error, isAdmin, addOrden, updateEstado, deleteOrden, ordenesListas };
};