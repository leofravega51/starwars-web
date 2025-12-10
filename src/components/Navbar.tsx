import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { showConfirm, showInfo } = useDialog();
  const navigate = useNavigate();

  const handleLogout = () => {
    showConfirm(
      '¿Estás seguro de que deseas cerrar sesión?',
      async () => {
        // Esperar un momento adicional para asegurar que el diálogo anterior se cierre
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Mostrar diálogo de información mientras se cierra la sesión
        showInfo('Cerrando sesión... Redirigiendo...', 'Cerrando Sesión', true, 2000);
        
        // Esperar antes de cerrar sesión y redirigir (igual que en login)
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      },
      'Confirmar Cierre de Sesión'
    );
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

