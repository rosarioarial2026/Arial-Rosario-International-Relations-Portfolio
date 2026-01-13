// src/App.js - Complete with Admin Routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Articles from './pages/Articles';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Resume from './pages/Resume';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import BlogEditor from './pages/BlogEditor';
import ResearchEditor from './pages/ResearchEditor';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login Route (no header/footer) */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes (protected) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/new"
            element={
              <ProtectedRoute>
                <BlogEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/edit/:id"
            element={
              <ProtectedRoute>
                <BlogEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/research/new"
            element={
              <ProtectedRoute>
                <ResearchEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/research/edit/:id"
            element={
              <ProtectedRoute>
                <ResearchEditor />
              </ProtectedRoute>
            }
          />

          {/* Public Routes (with header/footer) */}
          <Route
            path="/*"
            element={
              <>
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blogs/:slug" element={<BlogDetail />} />
                    <Route path="/resume" element={<Resume />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
