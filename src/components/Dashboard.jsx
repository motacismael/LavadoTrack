import { useMemo } from "react";
import { useOrdenes } from "@/hooks/useOrdenes";

// ─── Precios por servicio ────────────────────────────────────────────────────
const PRECIOS = {
  lavado: 150,
  planchado: 100,
  "lavado+planchado": 220,
};

// ─── Íconos SVG inline ───────────────────────────────────────────────────────
const Icon = {
  ClipboardList: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  DollarSign: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  TrendingUp: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const isHoy = (fecha) => {
  if (!fecha) return false;
  const d = fecha.toDate ? fecha.toDate() : new Date(fecha);
  const hoy = new Date();
  return (
    d.getFullYear() === hoy.getFullYear() &&
    d.getMonth() === hoy.getMonth() &&
    d.getDate() === hoy.getDate()
  );
};

const isSemana = (fecha) => {
  if (!fecha) return false;
  const d = fecha.toDate ? fecha.toDate() : new Date(fecha);
  const hace7dias = new Date();
  hace7dias.setDate(hace7dias.getDate() - 7);
  return d >= hace7dias;
};

const isAtrasada = (orden) => {
  if (!orden.createdAt) return false;
  const creacion = orden.createdAt.toDate
    ? orden.createdAt.toDate()
    : new Date(orden.createdAt);
  const horasTranscurridas = (Date.now() - creacion.getTime()) / (1000 * 60 * 60);
  return (
    horasTranscurridas > 24 &&
    orden.estado !== "entregada" &&
    orden.estado !== "lista"
  );
};

const formatMoney = (n) =>
  n.toLocaleString("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  });

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const StatCard = ({ icon: IconComp, label, value, color, sub }) => {
  const colors = {
    blue:   { bg: "bg-blue-50",   text: "text-blue-600",   ring: "ring-blue-100",   num: "text-blue-700" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-600", ring: "ring-yellow-100", num: "text-yellow-700" },
    green:  { bg: "bg-green-50",  text: "text-green-600",  ring: "ring-green-100",  num: "text-green-700" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-100", num: "text-purple-700" },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className={`bg-white rounded-2xl shadow-sm ring-1 ${c.ring} p-5 flex items-start gap-4 hover:shadow-md transition-shadow`}>
      <div className={`${c.bg} ${c.text} p-3 rounded-xl shrink-0`}>
        <IconComp />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
        <p className={`text-3xl font-bold mt-0.5 ${c.num}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
};

const IngresoBar = ({ servicio, monto, porcentaje, count }) => {
  const colores = {
    lavado: "bg-blue-500",
    planchado: "bg-purple-500",
    "lavado+planchado": "bg-green-500",
  };
  const labels = {
    lavado: "Lavado",
    planchado: "Planchado",
    "lavado+planchado": "Lavado + Planchado",
  };
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-gray-700">{labels[servicio] || servicio}</span>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">{count} {count === 1 ? "ord." : "ords."}</span>
          <span className="font-bold text-gray-800">{formatMoney(monto)}</span>
        </div>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colores[servicio] || "bg-gray-400"}`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  );
};

const EstadoBadge = ({ estado }) => {
  const map = {
    recibida:     "bg-gray-100 text-gray-600",
    "en proceso": "bg-blue-100 text-blue-700",
    lista:        "bg-green-100 text-green-700",
    entregada:    "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[estado] || "bg-gray-100 text-gray-600"}`}>
      {estado}
    </span>
  );
};

// ─── DASHBOARD PRINCIPAL ─────────────────────────────────────────────────────
const Dashboard = () => {
  const { ordenes = [], loading } = useOrdenes();

  const stats = useMemo(() => {
    const hoy        = ordenes.filter((o) => isHoy(o.createdAt));
    const semana     = ordenes.filter((o) => isSemana(o.createdAt));
    const pendientes = ordenes.filter((o) => o.estado === "recibida" || o.estado === "en proceso");
    const listas     = ordenes.filter((o) => o.estado === "lista");
    const atrasadas  = ordenes.filter(isAtrasada);

    // Ingresos: órdenes que ya avanzaron de "recibida"
    const activas = ordenes.filter((o) => o.estado !== "recibida");
    const ingresosPorServicio = {};
    activas.forEach((o) => {
      const svc = o.servicio || "otro";
      if (!ingresosPorServicio[svc]) ingresosPorServicio[svc] = { monto: 0, count: 0 };
      ingresosPorServicio[svc].monto += PRECIOS[svc] || 0;
      ingresosPorServicio[svc].count += 1;
    });

    const totalIngresos = Object.values(ingresosPorServicio).reduce((a, b) => a + b.monto, 0);
    const ingresoHoy = hoy
      .filter((o) => o.estado !== "recibida")
      .reduce((sum, o) => sum + (PRECIOS[o.servicio] || 0), 0);

    return { hoy: hoy.length, semana: semana.length, pendientes: pendientes.length,
      listas: listas.length, atrasadas, ingresosPorServicio, totalIngresos,
      ingresoHoy, listasSinRecoger: listas };
  }, [ordenes]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const maxIngreso = Math.max(...Object.values(stats.ingresosPorServicio).map((v) => v.monto), 1);

  return (
    <div className="space-y-8 pb-8">

      {/* ── ALERTAS ─────────────────────────────────────────────── */}
      {(stats.atrasadas.length > 0 || stats.listasSinRecoger.length > 0) && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Icon.Bell /> Alertas
          </h3>

          {stats.atrasadas.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="text-red-500 shrink-0 mt-0.5"><Icon.AlertTriangle /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-700 text-sm">
                  {stats.atrasadas.length} {stats.atrasadas.length === 1 ? "orden atrasada" : "órdenes atrasadas"} (+24 h sin avanzar)
                </p>
                <div className="mt-2 space-y-1">
                  {stats.atrasadas.slice(0, 3).map((o) => (
                    <div key={o.id} className="flex items-center justify-between text-xs text-red-600 bg-red-100 rounded-lg px-3 py-1.5 gap-2">
                      <span className="font-mono font-bold shrink-0">{o.ticket}</span>
                      <span className="truncate flex-1 text-center">{o.cliente}</span>
                      <EstadoBadge estado={o.estado} />
                    </div>
                  ))}
                  {stats.atrasadas.length > 3 && (
                    <p className="text-xs text-red-400 pl-1">+{stats.atrasadas.length - 3} más…</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {stats.listasSinRecoger.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="text-green-500 shrink-0 mt-0.5"><Icon.CheckCircle /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-green-700 text-sm">
                  {stats.listasSinRecoger.length} {stats.listasSinRecoger.length === 1 ? "orden lista sin recoger" : "órdenes listas sin recoger"}
                </p>
                <div className="mt-2 space-y-1">
                  {stats.listasSinRecoger.slice(0, 3).map((o) => (
                    <div key={o.id} className="flex items-center justify-between text-xs text-green-700 bg-green-100 rounded-lg px-3 py-1.5 gap-2">
                      <span className="font-mono font-bold shrink-0">{o.ticket}</span>
                      <span className="truncate flex-1 text-center">{o.cliente}</span>
                      <span className="text-green-500 shrink-0">{o.servicio}</span>
                    </div>
                  ))}
                  {stats.listasSinRecoger.length > 3 && (
                    <p className="text-xs text-green-400 pl-1">+{stats.listasSinRecoger.length - 3} más…</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── TARJETAS ─────────────────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
          Resumen de Órdenes
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Icon.ClipboardList} label="Órdenes Hoy"  value={stats.hoy}       color="blue"   />
          <StatCard icon={Icon.TrendingUp}    label="Esta Semana"  value={stats.semana}     color="purple" sub="Últimos 7 días" />
          <StatCard icon={Icon.Clock}         label="Pendientes"   value={stats.pendientes} color="yellow" sub="Recibidas o en proceso" />
          <StatCard icon={Icon.CheckCircle}   label="Listas"       value={stats.listas}     color="green"  sub="Sin recoger" />
        </div>
      </section>

      {/* ── INGRESOS ─────────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-600 p-2 rounded-xl"><Icon.DollarSign /></div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800">Reporte de Ingresos</h3>
              <p className="text-xs text-gray-400">Órdenes en proceso, listas y entregadas</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Total acumulado</p>
            <p className="text-2xl font-bold text-green-600">{formatMoney(stats.totalIngresos)}</p>
            {stats.ingresoHoy > 0 && (
              <p className="text-xs text-gray-400">
                Hoy: <span className="text-green-500 font-semibold">{formatMoney(stats.ingresoHoy)}</span>
              </p>
            )}
          </div>
        </div>

        {Object.keys(stats.ingresosPorServicio).length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">No hay ingresos registrados aún.</p>
        ) : (
          <div className="space-y-5">
            {Object.entries(stats.ingresosPorServicio)
              .sort((a, b) => b[1].monto - a[1].monto)
              .map(([svc, { monto, count }]) => (
                <IngresoBar key={svc} servicio={svc} monto={monto}
                  porcentaje={(monto / maxIngreso) * 100} count={count} />
              ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Dashboard;
