import { useState } from "react";
import { useOrdenes } from "@/hooks/useOrdenes";

const OrdenForm = () => {
  const { addOrden } = useOrdenes();

  const [cliente, setCliente] = useState("");
  const [servicio, setServicio] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cliente || !servicio) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      await addOrden({ cliente, servicio });
      setCliente("");
      setServicio("");
      setError("");
    } catch (err) {
      setError("Error al crear la orden");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Nueva Orden</h2>

      {error && (
        <p className="text-red-500 mb-2" role="alert">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Nombre del cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      <select
        value={servicio}
        onChange={(e) => setServicio(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      >
        <option value="">Selecciona servicio</option>
        <option value="lavado">Lavado</option>
        <option value="planchado">Planchado</option>
        <option value="lavado+planchado">Lavado + Planchado</option>
      </select>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Crear Orden
      </button>
    </form>
  );
};

export default OrdenForm;