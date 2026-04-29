import { useState } from 'react';
import { useClientes } from '@/hooks/useClientes';

export const ClienteForm = ({ clienteAEditar, onSuccess, onCancel }) => {
  const { addCliente, updateCliente } = useClientes();
  const [nombre, setNombre] = useState(clienteAEditar?.nombre || '');
  const [telefono, setTelefono] = useState(clienteAEditar?.telefono || '');
  const [email, setEmail] = useState(clienteAEditar?.email || '');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!nombre.trim() || !telefono.trim()) {
      setError('El nombre y el teléfono son obligatorios.');
      return;
    }

    // Validación de formato de teléfono (solo números, permitiendo espacios opcionales o guiones si se deseara, pero la regla estricta es solo números)
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(telefono.replace(/\s+/g, ''))) {
      setError('El teléfono debe contener solo números.');
      return;
    }

    setIsSubmitting(true);
    try {
      const clienteData = {
        nombre: nombre.trim(),
        telefono: telefono.replace(/\s+/g, ''),
        email: email.trim() || null, // Opcional
      };

      if (clienteAEditar?.id) {
        await updateCliente(clienteAEditar.id, clienteData);
      } else {
        await addCliente(clienteData);
      }
      
      if (onSuccess) onSuccess();
      
      // Limpiar el formulario si es uno nuevo
      if (!clienteAEditar) {
        setNombre('');
        setTelefono('');
        setEmail('');
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al guardar el cliente. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {clienteAEditar ? 'Editar Cliente' : 'Nuevo Cliente'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div role="alert" className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ej. Juan Pérez"
          />
        </div>

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ej. 8095551234"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Opcional)</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="juan@correo.com"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;
