// src/pages/Home.js
// Arial Rosario - International Relations Portfolio
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Globe, TrendingUp, Users, Download, Eye } from 'lucide-react';
import { articlesAPI } from '../lib/supabase';
import './Home.css';

const Home = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeaturedArticles();
  }, []);

  const loadFeaturedArticles = async () => {
    try {
      setLoading(true);
      
      // Fetch featured articles from Supabase
      const data = await articlesAPI.getFeatured(3); // Get 3 featured articles
      
      console.log('Featured articles data:', data);
      
      // Ensure we have an array
      const articlesArray = Array.isArray(data) ? data : [];
      setFeaturedArticles(articlesArray);
      setError(null);
    } catch (err) {
      console.error('Error loading featured articles:', err);
      setError(err.message);
      setFeaturedArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const skills = [
    { name: 'Policy Analysis', level: 90, color: '#6366f1' },
    { name: 'Diplomatic Communication', level: 88, color: '#8b5cf6' },
    { name: 'International Law', level: 85, color: '#ec4899' },
    { name: 'Travel Blogging', level: 93, color: '#f59e0b' },
    { name: 'Cross-Cultural Relations', level: 95, color: '#10b981' },
    { name: 'Storytelling & Writing', level: 92, color: '#3b82f6' }
  ];

  const stats = [
    { label: 'Years Experience', value: '3+', icon: TrendingUp },
    { label: 'Projects Completed', value: '15+', icon: BookOpen },
    { label: 'Countries Worked', value: '8+', icon: Globe },
    { label: 'Stakeholder Relations', value: '50+', icon: Users }
  ];

  return (
    <div 
      className="home"
      style={{
        // OPTION 1: Teal gradient (currently active)
        //background: 'linear-gradient(135deg, #3b9c9c 0%, #5bb5b5 50%, #7dcdcd 100%)',
        
        // OPTION 2: Your background image (uncomment to use)
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-photo-section">
              <div className="profile-photo">
                <img 
                  src="/images/profile.jpg" 
                  alt="Arial Rosario - International Relations Specialist"
                  className="profile-image"
                  onError={(e) => {
                    // Hide image if not found
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
            
            <div className="hero-text-section">
              <div className="hero-text">
                <h1 className="hero-title">
                  <span className="hero-name">Arial Rosario</span>
                  <span className="hero-role">International Relations Specialist</span>
                </h1>
                <p className="hero-description">
                  Passionate about global diplomacy and international cooperation with 3 years of 
                  experience in policy analysis, stakeholder engagement, and cross-cultural communication. 
                  I love traveling around the world and telling people's stories through engaging blogs, 
                  bridging cultures and fostering understanding through authentic narratives.
                </p>
                <div className="hero-actions">
                  <Link to="/articles" className="btn btn-primary">
                    <BookOpen size={20} />
                    View Projects
                  </Link>
                  <Link to="/resume" className="btn btn-secondary">
                    <Globe size={20} />
                    See Experience
                  </Link>
                </div>
              </div>
              
              <div className="hero-stats">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="stat-item" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills-section">
        <div className="container">
          <h2 className="section-title">Core Competencies</h2>
          <p className="section-subtitle">
            Expertise in international relations, policy development, and cultural storytelling
          </p>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={skill.name} className="skill-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percentage">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div 
                    className="skill-fill" 
                    style={{ 
                      width: `${skill.level}%`,
                      backgroundColor: skill.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="featured-articles">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Work & Stories</h2>
            <p className="section-subtitle">
              Recent projects, publications, and travel stories from around the world
            </p>
            <Link to="/articles" className="view-all-link">
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading featured projects...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>Unable to load projects: {error}</p>
              <button onClick={loadFeaturedArticles} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : (
            <div className="articles-grid">
              {featuredArticles.length > 0 ? featuredArticles.map((article) => (
                <article key={article.id} className="article-card">
                  <div className="article-header">
                    <div className="article-meta">
                      <span className="article-type">{(article.type || 'project').replace('_', ' ')}</span>
                      <span className="article-year">{article.publication?.year || 'Recent'}</span>
                    </div>
                    <div className="article-stats">
                      <span className="stat">
                        <Eye size={14} />
                        {article.views || 0}
                      </span>
                      <span className="stat">
                        <Download size={14} />
                        {article.downloads || 0}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="article-title">
                    {article.publication?.url ? (
                      <a 
                        href={article.publication.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {article.title || 'Untitled Project'}
                      </a>
                    ) : (
                      <span>{article.title || 'Untitled Project'}</span>
                    )}
                  </h3>
                  
                  <p className="article-abstract">
                    {(article.abstract || 'No description available').substring(0, 150)}...
                  </p>
                  
                  <div className="article-footer">
                    <div className="article-tags">
                      {(article.tags || []).slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                    {article.publication?.url && (
                      <a 
                        href={article.publication.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="read-more"
                      >
                        View Project <ArrowRight size={14} />
                      </a>
                    )}
                    {article.publication?.doi && (
                      <a 
                        href={`https://doi.org/${article.publication.doi}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="read-more doi-link"
                      >
                        DOI <ArrowRight size={14} />
                      </a>
                    )}
                  </div>
                </article>
              )) : (
                <div className="no-articles">
                  <p>No featured projects available yet. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Let's Connect</h2>
            <p className="cta-description">
              Interested in collaboration, consulting on international relations, or discussing 
              policy initiatives? I'd love to connect with you.
            </p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary">
                Get In Touch
              </Link>
              <Link to="/resume" className="btn btn-outline">
                View Resume
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;