import { useOrdenes } from "@/hooks/useOrdenes";

const OrdenList = () => {
  const { ordenes, updateEstado, ordenesListas, loading } = useOrdenes();

  if (loading) {
    return <p>Cargando órdenes...</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Órdenes</h2>

      {/* 🔥 ÓRDENES LISTAS (IMPORTANTE DEL PROYECTO) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-green-600">
          Órdenes listas sin recoger
        </h3>

        {ordenesListas.length === 0 && (
          <p className="text-gray-500">No hay órdenes listas</p>
        )}

        {ordenesListas.map((o) => (
          <div
            key={o.id}
            className="bg-green-100 p-3 rounded mt-2"
          >
            <p><strong>{o.ticket}</strong></p>
            <p>{o.cliente} - {o.servicio}</p>
          </div>
        ))}
      </div>

      {/* 🔥 TODAS LAS ÓRDENES */}
      {ordenes.map((o) => (
        <div
          key={o.id}
          className="border p-4 rounded mb-3 shadow"
        >
          <p><strong>Ticket:</strong> {o.ticket}</p>
          <p><strong>Cliente:</strong> {o.cliente}</p>
          <p><strong>Servicio:</strong> {o.servicio}</p>
          <p><strong>Estado:</strong> {o.estado}</p>

          <select
            value={o.estado}
            onChange={(e) =>
              updateEstado(o.id, e.target.value)
            }
            className="border p-2 mt-2 rounded"
          >
            <option value="recibida">Recibida</option>
            <option value="en proceso">En proceso</option>
            <option value="lista">Lista</option>
            <option value="entregada">Entregada</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default OrdenList;