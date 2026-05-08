import { useState, useEffect } from "react";
import { supabase } from "@/supabase/config";
import { useAuth } from "@/context/AuthContext";

export const useOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchOrdenes = async () => {
    if (!currentUser) return;
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("ordenes")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError("Error al cargar órdenes");
    } else {
      setOrdenes((data || []).map((r) => ({ ...r, createdAt: r.created_at })));
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!currentUser) {
      setOrdenes([]);
      setLoading(false);
      return;
    }

    fetchOrdenes();

    // Nombre único por instancia para evitar conflictos entre componentes
    const channelName = `ordenes-${currentUser.id}-${Math.random()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ordenes",
          filter: `user_id=eq.${currentUser.id}`,
        },
        () => fetchOrdenes()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentUser]);

  const addOrden = async (ordenData) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    const ticket = "T-" + Date.now();
    const { error: insertError } = await supabase.from("ordenes").insert({
      ...ordenData,
      ticket,
      estado: "recibida",
      user_id: currentUser.id,
    });
    if (insertError) throw insertError;
  };

  const updateEstado = async (id, estado) => {
    const { error: updateError } = await supabase
      .from("ordenes")
      .update({ estado })
      .eq("id", id);
    if (updateError) throw updateError;
  };

  const deleteOrden = async (id) => {
    const { error: deleteError } = await supabase
      .from("ordenes")
      .delete()
      .eq("id", id);
    if (deleteError) throw deleteError;
  };

  const ordenesListas = ordenes.filter((o) => o.estado === "lista");

  return { ordenes, loading, error, addOrden, updateEstado, deleteOrden, ordenesListas };
};
