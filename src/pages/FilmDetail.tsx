import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import { Loading } from '../components/Loading';
import type { Film } from '../types';
import './FilmDetail.css';

export const FilmDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { isAdmin } = useAuth();
  const { showError, showSuccess, showConfirm } = useDialog();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadFilm(id);
    }
  }, [id]);

  const loadFilm = async (filmId: string) => {
    try {
      setLoading(true);
      const data = await apiService.getFilm(filmId);
      setFilm(data);
    } catch (err: any) {
      showError(err.message || 'Error al cargar la película');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!film) return;

    showConfirm(
      `¿Estás seguro de eliminar "${film.title}"? Esta acción no se puede deshacer.`,
      async () => {
        try {
          setDeleting(true);
          await apiService.deleteFilm(film._id);
          showSuccess('Película eliminada correctamente');
          navigate('/films');
        } catch (err: any) {
          showError(err.message || 'Error al eliminar la película');
          setDeleting(false);
        }
      },
      'Confirmar eliminación'
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loading />;

  if (!film) {
    return (
      <div className="container">
        <Link to="/films" className="btn btn-secondary">Volver a películas</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="film-detail">
        <div className="film-detail-header">
          <div>
            <h1>Episodio {film.episode_id}: {film.title}</h1>
            <div className="badges">
              {film.source === 'api' && <span className="badge badge-api">API</span>}
              {film.source === 'local' && <span className="badge badge-local">Local</span>}
              {film.isModified && <span className="badge badge-modified">Modificado</span>}
            </div>
          </div>
          
          {isAdmin() && (
            <div className="film-actions">
              <Link to={`/films/${film._id}/edit`} className="btn btn-primary">
                Editar
              </Link>
              <button 
                onClick={handleDelete} 
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          )}
        </div>

        <div className="film-crawl">
          <h2>Introducción</h2>
          <p>{film.opening_crawl}</p>
        </div>

        <div className="film-info-grid">
          <div className="info-card">
            <h3>Director</h3>
            <p>{film.director}</p>
          </div>

          <div className="info-card">
            <h3>Productor(es)</h3>
            <p>{film.producer}</p>
          </div>

          <div className="info-card">
            <h3>Fecha de Estreno</h3>
            <p>{formatDate(film.release_date)}</p>
          </div>

          <div className="info-card">
            <h3>Episodio</h3>
            <p>{film.episode_id}</p>
          </div>
        </div>

        {film.description && (
          <div className="info-card">
            <h3>Descripción</h3>
            <p>{film.description}</p>
          </div>
        )}

        <div className="film-stats">
          <div className="stat-card">
            <strong>Personajes</strong>
            <span>{film.characters.length}</span>
          </div>
          <div className="stat-card">
            <strong>Planetas</strong>
            <span>{film.planets.length}</span>
          </div>
          <div className="stat-card">
            <strong>Naves</strong>
            <span>{film.starships.length}</span>
          </div>
          <div className="stat-card">
            <strong>Vehículos</strong>
            <span>{film.vehicles.length}</span>
          </div>
          <div className="stat-card">
            <strong>Especies</strong>
            <span>{film.species.length}</span>
          </div>
        </div>

        {film.lastSyncDate && (
          <div className="sync-info">
            <small>Última sincronización: {formatDate(film.lastSyncDate)}</small>
          </div>
        )}

        <div className="back-link">
          <Link to="/films" className="btn btn-secondary">← Volver a películas</Link>
        </div>
      </div>
    </div>
  );
};

