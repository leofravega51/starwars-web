import { useState } from 'react';
import { apiService } from '../services/api';
import type { SyncResult } from '../types';
import './SyncPage.css';

export const SyncPage = () => {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState('');

  const handleSync = async () => {
    if (!window.confirm('¿Estás seguro de sincronizar las películas desde la API externa?')) {
      return;
    }

    setSyncing(true);
    setError('');
    setResult(null);

    try {
      const data = await apiService.syncFilms();
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error al sincronizar');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="container">
      <div className="sync-container">
        <h1>Sincronizar Películas</h1>
        
        <div className="sync-info">
          <p>
            Esta acción sincronizará todas las películas desde la API externa de Star Wars (SWAPI) 
            con tu base de datos local.
          </p>
          <ul>
            <li>✅ Las películas nuevas se agregarán automáticamente</li>
            <li>✅ Las películas existentes sin modificar se actualizarán</li>
            <li>⏭️ Las películas modificadas localmente se omitirán</li>
            <li>📌 Las películas creadas localmente no se verán afectadas</li>
          </ul>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {result && (
          <div className="sync-result">
            <div className="alert alert-success">
              <h3>{result.message}</h3>
              <div className="result-stats">
                <div className="stat">
                  <strong>Total:</strong> {result.total}
                </div>
                <div className="stat success">
                  <strong>Exitosas:</strong> {result.success}
                </div>
                <div className="stat failed">
                  <strong>Fallidas:</strong> {result.failed}
                </div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="errors-list">
                <h4>Advertencias:</h4>
                <ul>
                  {result.errors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button 
          onClick={handleSync} 
          className="btn btn-primary btn-large"
          disabled={syncing}
        >
          {syncing ? '🔄 Sincronizando...' : '🔄 Sincronizar Ahora'}
        </button>
      </div>
    </div>
  );
};

