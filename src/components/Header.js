import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsAdmin(session.user.email === 'rosarioarial2026@gmail.com');
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setIsAdmin(user.email === 'rosarioarial2026@gmail.com');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo/Name */}
          <Link to="/" className="header-logo" onClick={closeMenu}>
            <span className="logo-icon">🌍</span>
            <div className="logo-text">
              <h1>Arial Rosario</h1>
              <p>International Relations Specialist</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/articles" 
              className={`nav-link ${isActive('/articles') ? 'active' : ''}`}
            >
              Research
            </Link>
            <Link 
              to="/blogs" 
              className={`nav-link ${isActive('/blogs') ? 'active' : ''}`}
            >
              Blog
            </Link>
            <Link 
              to="/resume" 
              className={`nav-link ${isActive('/resume') ? 'active' : ''}`}
            >
              Resume
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            >
              Contact
            </Link>

            {/* Auth Buttons */}
            {user ? (
              // Logged in - show Dashboard (if admin) + Logout
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="nav-link admin-link">
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="auth-btn logout-btn">
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              // Not logged in - show Sign In
              <Link to="/login" className="auth-btn signin-btn">
                <LogIn size={18} />
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`nav-mobile ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            to="/articles" 
            className={`nav-link ${isActive('/articles') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Research
          </Link>
          <Link 
            to="/blogs" 
            className={`nav-link ${isActive('/blogs') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Blog
          </Link>
          <Link 
            to="/resume" 
            className={`nav-link ${isActive('/resume') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Resume
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Contact
          </Link>

          {/* Mobile Auth Buttons */}
          <div className="mobile-auth-section">
            {user ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="nav-link admin-link"
                    onClick={closeMenu}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                )}
                <button onClick={() => { handleLogout(); closeMenu(); }} className="auth-btn logout-btn">
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="auth-btn signin-btn" onClick={closeMenu}>
                <LogIn size={18} />
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;