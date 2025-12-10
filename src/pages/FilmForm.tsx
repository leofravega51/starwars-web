import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Loading } from '../components/Loading';
import { useDialog } from '../context/DialogContext';
import type { CreateFilmDto } from '../types';
import './FilmForm.css';

export const FilmForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showError, showSuccess } = useDialog();
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<CreateFilmDto>({
    title: '',
    episode_id: 1,
    opening_crawl: '',
    director: '',
    producer: '',
    release_date: '',
    characters: [],
    planets: [],
    starships: [],
    vehicles: [],
    species: [],
    description: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      loadFilm(id);
    }
  }, [id, isEdit]);

  const loadFilm = async (filmId: string) => {
    try {
      setLoading(true);
      const data = await apiService.getFilm(filmId);
      setFormData({
        title: data.title,
        episode_id: data.episode_id,
        opening_crawl: data.opening_crawl,
        director: data.director,
        producer: data.producer,
        release_date: data.release_date,
        characters: data.characters,
        planets: data.planets,
        starships: data.starships,
        vehicles: data.vehicles,
        species: data.species,
        description: data.description || '',
      });
    } catch (err: any) {
      showError(err.message || 'Error al cargar la película');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'episode_id' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEdit && id) {
        await apiService.updateFilm(id, formData);
        showSuccess('Película actualizada correctamente');
      } else {
        await apiService.createFilm(formData);
        showSuccess('Película creada correctamente');
      }
      navigate('/films');
    } catch (err: any) {
      showError(err.response?.data?.message || err.message || 'Error al guardar la película');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container">
      <div className="form-container">
        <h1>{isEdit ? 'Editar Película' : 'Nueva Película'}</h1>
        
        <form onSubmit={handleSubmit} className="film-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Título *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="episode_id">Episodio *</label>
              <input
                type="number"
                id="episode_id"
                name="episode_id"
                value={formData.episode_id}
                onChange={handleChange}
                required
                min="1"
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="opening_crawl">Introducción *</label>
            <textarea
              id="opening_crawl"
              name="opening_crawl"
              value={formData.opening_crawl}
              onChange={handleChange}
              required
              rows={5}
              disabled={saving}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="director">Director *</label>
              <input
                type="text"
                id="director"
                name="director"
                value={formData.director}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="producer">Productor(es) *</label>
              <input
                type="text"
                id="producer"
                name="producer"
                value={formData.producer}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="release_date">Fecha de Estreno *</label>
            <input
              type="date"
              id="release_date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              disabled={saving}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
            </button>
            <Link to="/films" className="btn btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

