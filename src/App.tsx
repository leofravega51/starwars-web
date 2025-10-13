import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { FilmList } from './pages/FilmList';
import { FilmDetail } from './pages/FilmDetail';
import { FilmForm } from './pages/FilmForm';
import { SyncPage } from './pages/SyncPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/films" element={<FilmList />} />
              
              <Route 
                path="/films/new" 
                element={
                  <ProtectedRoute requireAdmin>
                    <FilmForm />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/films/:id" 
                element={
                  <ProtectedRoute>
                    <FilmDetail />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/films/:id/edit" 
                element={
                  <ProtectedRoute requireAdmin>
                    <FilmForm />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/sync" 
                element={
                  <ProtectedRoute requireAdmin>
                    <SyncPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="footer">
            <p>Star Wars Films &copy; 2024 | Que la Fuerza te acompañe</p>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

