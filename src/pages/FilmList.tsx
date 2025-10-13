import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { FilmCard } from '../components/FilmCard';
import { Loading } from '../components/Loading';
import type { Film } from '../types';
import './FilmList.css';

export const FilmList = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'api' | 'local' | 'modified'>('all');

  useEffect(() => {
    loadFilms();
  }, []);

  const loadFilms = async () => {
    try {
      setLoading(true);
      const data = await apiService.getFilms();
      setFilms(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las películas');
    } finally {
      setLoading(false);
    }
  };

  const filteredFilms = films.filter(film => {
    if (filter === 'all') return true;
    if (filter === 'api') return film.source === 'api';
    if (filter === 'local') return film.source === 'local';
    if (filter === 'modified') return film.isModified;
    return true;
  }).sort((a, b) => a.episode_id - b.episode_id);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Películas de Star Wars</h1>
        
        <div className="filter-buttons">
          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            Todas ({films.length})
          </button>
          <button 
            className={`btn ${filter === 'api' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('api')}
          >
            API ({films.filter(f => f.source === 'api').length})
          </button>
          <button 
            className={`btn ${filter === 'local' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('local')}
          >
            Locales ({films.filter(f => f.source === 'local').length})
          </button>
          <button 
            className={`btn ${filter === 'modified' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('modified')}
          >
            Modificadas ({films.filter(f => f.isModified).length})
          </button>
        </div>
      </div>

      {filteredFilms.length === 0 ? (
        <div className="empty-state">
          <p>No hay películas para mostrar</p>
        </div>
      ) : (
        <div className="films-grid">
          {filteredFilms.map(film => (
            <FilmCard key={film._id} film={film} />
          ))}
        </div>
      )}
    </div>
  );
};

