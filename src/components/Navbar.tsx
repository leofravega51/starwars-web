import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          ⭐ Star Wars Films
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/films" className="nav-link">Películas</Link>
          
          {user ? (
            <>
              {isAdmin() && (
                <>
                  <Link to="/films/new" className="nav-link">Nueva Película</Link>
                  <Link to="/sync" className="nav-link">Sincronizar</Link>
                </>
              )}
              <span className="user-info">
                👤 {user.displayName || user.username} 
                {isAdmin() && <span className="badge">Admin</span>}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              <Link to="/register" className="btn-register">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

