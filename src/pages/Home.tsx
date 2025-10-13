import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Bienvenido a Star Wars Films</h1>
        <p className="hero-subtitle">
          Explora todas las películas de la saga Star Wars
        </p>
        
        <div className="hero-actions">
          <Link to="/films" className="btn btn-primary">
            Ver Películas
          </Link>
          {!user && (
            <Link to="/register" className="btn btn-secondary">
              Registrarse
            </Link>
          )}
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🎬</div>
          <h3>Catálogo Completo</h3>
          <p>Accede a todas las películas de Star Wars con información detallada</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔐</div>
          <h3>Gestión Avanzada</h3>
          <p>Los administradores pueden crear, editar y eliminar películas</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔄</div>
          <h3>Sincronización</h3>
          <p>Mantén actualizada la base de datos con la API de Star Wars</p>
        </div>
      </div>
    </div>
  );
};

