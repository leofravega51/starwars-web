import { Link } from 'react-router-dom';
import type { Film } from '../types';
import './FilmCard.css';

interface FilmCardProps {
  film: Film;
}

export const FilmCard = ({ film }: FilmCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/films/${film._id}`} className="film-card">
      <div className="film-card-header">
        <h3 className="film-title">
          Episodio {film.episode_id}: {film.title}
        </h3>
        {film.source === 'api' && (
          <span className="badge badge-api">API</span>
        )}
        {film.source === 'local' && (
          <span className="badge badge-local">Local</span>
        )}
        {film.isModified && (
          <span className="badge badge-modified">Modificado</span>
        )}
      </div>
      
      <div className="film-card-body">
        <p className="film-opening">
          {film.opening_crawl.substring(0, 150)}...
        </p>
        
        <div className="film-meta">
          <div className="meta-item">
            <strong>Director:</strong> {film.director}
          </div>
          <div className="meta-item">
            <strong>Estreno:</strong> {formatDate(film.release_date)}
          </div>
        </div>
      </div>
    </Link>
  );
};

