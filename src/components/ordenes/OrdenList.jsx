import { useState } from "react";
import { useOrdenes } from "@/hooks/useOrdenes";

const ESTADOS = ["todos", "recibida", "en proceso", "lista", "entregada"];

const estadoStyles = {
  recibida:     { badge: "bg-gray-100 text-gray-600",   dot: "bg-gray-400" },
  "en proceso": { badge: "bg-blue-100 text-blue-700",   dot: "bg-blue-500" },
  lista:        { badge: "bg-green-100 text-green-700", dot: "bg-green-500" },
  entregada:    { badge: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
};

const formatFecha = (fecha) => {
  if (!fecha) return "—";
  const d = fecha.toDate ? fecha.toDate() : new Date(fecha);
  return d.toLocaleString("es-DO", {
    day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
};

const servicioLabel = {
  lavado: "Lavado",
  planchado: "Planchado",
  "lavado+planchado": "Lavado + Planchado",
};

const OrdenList = () => {
  // ✅ CAMBIO 1: agregado deleteOrden
  const { ordenes, updateEstado, deleteOrden, loading } = useOrdenes();
  const [filtro, setFiltro] = useState("todos");

  const ordenesFiltradas = filtro === "todos"
    ? ordenes
    : ordenes.filter((o) => o.estado === filtro);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ENCABEZADO + FILTROS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Órdenes</h2>
          <p className="text-xs text-gray-400">{ordenes.length} en total</p>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {ESTADOS.map((e) => (
            <button
              key={e}
              onClick={() => setFiltro(e)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                filtro === e
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300"
              }`}
            >
              {e === "todos" ? "Todos" : e}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA */}
      {ordenesFiltradas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-sm">
            No hay órdenes {filtro !== "todos" ? `con estado "${filtro}"` : ""}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ordenesFiltradas.map((o) => {
            const style = estadoStyles[o.estado] || estadoStyles.recibida;
            return (
              <div
                key={o.id}
                className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* DOT DE ESTADO */}
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.dot} hidden sm:block`} />

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-gray-400">{o.ticket}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                      {o.estado}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800 mt-1">{o.cliente}</p>
                  <p className="text-sm text-gray-500">{servicioLabel[o.servicio] || o.servicio}</p>
                  <p className="text-xs text-gray-300 mt-1">{formatFecha(o.createdAt)}</p>
                </div>

                {/* CAMBIAR ESTADO */}
                <div className="shrink-0">
                  <select
                    value={o.estado}
                    onChange={(e) => updateEstado(o.id, e.target.value)}
                    className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="recibida">Recibida</option>
                    <option value="en proceso">En proceso</option>
                    <option value="lista">Lista</option>
                    <option value="entregada">Entregada</option>
                  </select>
                </div>

                {/* ✅ CAMBIO 2: botón eliminar */}
                <button
                  onClick={() => {
                    if (window.confirm(`¿Eliminar la orden ${o.ticket}?`)) {
                      deleteOrden(o.id);
                    }
                  }}
                  className="shrink-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Eliminar orden"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default OrdenList;
