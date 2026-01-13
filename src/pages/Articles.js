// src/pages/Articles.js
// UPDATED: Supabase integration with research_articles table
import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, Github, Database, FileText, Eye, Download } from 'lucide-react';
import { articlesAPI } from '../lib/supabase';
import './Articles.css';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, filterType, filterYear]);

  const fetchArticles = async () => {
    try {
      console.log('Fetching articles from Supabase...');
      setLoading(true);
      
      // Fetch all articles from Supabase (now using research_articles table)
      const data = await articlesAPI.getAll();
      
      console.log('Articles response:', data);
      
      // Ensure data is an array
      const articlesArray = Array.isArray(data) ? data : [];
      setArticles(articlesArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    if (!Array.isArray(articles)) {
      setFilteredArticles([]);
      return;
    }
    
    let filtered = articles.filter(article => {
      const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesType = filterType === 'all' || article.type === filterType;
      
      // Extract year from publication object or publication_date
      const articleYear = article.publication?.year || 
                         (article.publication_date ? new Date(article.publication_date).getFullYear() : null);
      const matchesYear = filterYear === 'all' || articleYear?.toString() === filterYear;
      
      return matchesSearch && matchesType && matchesYear;
    });
    
    setFilteredArticles(filtered);
  };

  const getAvailableYears = () => {
    if (!Array.isArray(articles) || articles.length === 0) {
      return [];
    }
    const years = [...new Set(articles.map(article => {
      return article.publication?.year || 
             (article.publication_date ? new Date(article.publication_date).getFullYear() : null);
    }).filter(year => year))];
    return years.sort((a, b) => b - a);
  };

  const getLinkIcon = (type) => {
    switch(type) {
      case 'code': return <Github size={16} />;
      case 'data': return <Database size={16} />;
      case 'preprint': return <FileText size={16} />;
      default: return <ExternalLink size={16} />;
    }
  };

  const getTypeBadgeClass = (type) => {
    if (!type) return 'type-default';
    return `type-${type.replace('_', '-')}`;
  };

  const formatType = (type) => {
    if (!type) return 'Article';
    // Convert snake_case to Title Case
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="articles-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="articles-page">
        <div className="container">
          <div className="error-state">
            <h2>Error Loading Articles</h2>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchArticles}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="articles-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Research & Publications</h1>
          <p className="page-subtitle">
            Academic work in international relations, policy analysis, and global affairs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="search-filters">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search articles,key words"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filters">
            <div className="filter-group">
              <Filter size={16} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="research_paper">Research Papers</option>
                <option value="policy_brief">Policy Briefs</option>
                <option value="working_paper">Working Papers</option>
                <option value="conference_presentation">Conference Presentations</option>
                <option value="report">Reports</option>
                <option value="thesis">Thesis</option>
              </select>
            </div>
            
            <div className="filter-group">
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Years</option>
                {getAvailableYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="results-summary">
          <p>Showing {filteredArticles?.length || 0} of {articles?.length || 0} articles</p>
        </div>

        {/* Articles List */}
        <div className="articles-list">
          {!Array.isArray(filteredArticles) || filteredArticles.length === 0 ? (
            <div className="no-results">
              <h3>No articles found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            filteredArticles.map(article => (
              <article key={article.id} className="article-card">
                {/* Article Header */}
                <div className="article-header">
                  <div className="article-meta">
                    <span className={`article-type ${getTypeBadgeClass(article.type)}`}>
                      {formatType(article.type)}
                    </span>
                    <span className="article-year">
                      {article.publication?.year || 
                       (article.publication_date ? new Date(article.publication_date).getFullYear() : 'N/A')}
                    </span>
                    {article.featured && <span className="featured-badge">Featured</span>}
                  </div>
                  
                  <div className="article-stats">
                    <span className="stat">
                      <Eye size={16} />
                      {article.views || 0}
                    </span>
                    <span className="stat">
                      <Download size={16} />
                      {article.downloads || 0}
                    </span>
                  </div>
                </div>

                {/* Article Title */}
                <h2 className="article-title">
                  <a href={`/articles/${article.slug || article.id}`}>
                    {article.title}
                  </a>
                </h2>

                {/* Authors */}
                {article.authors && article.authors.length > 0 && (
                  <div className="article-authors">
                    {article.authors.map((author, index) => (
                      <span key={index} className="author">
                        {author.name || author}
                        {author.affiliation && <span className="affiliation"> ({author.affiliation})</span>}
                        {index < article.authors.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}

                {/* Publication Info */}
                {article.publication && (
                  <div className="publication-info">
                    {article.publication.journal && (
                      <>
                        <strong>{article.publication.journal}</strong>
                        {article.publication.volume && (
                          <span>, Vol. {article.publication.volume}</span>
                        )}
                        {article.publication.pages && (
                          <span>, pp. {article.publication.pages}</span>
                        )}
                      </>
                    )}
                    {article.publication.conference && (
                      <strong>{article.publication.conference}</strong>
                    )}
                    {article.publication.institution && (
                      <strong>{article.publication.institution}</strong>
                    )}
                    {article.publication.year && (
                      <span> ({article.publication.year})</span>
                    )}
                    {article.publication.location && (
                      <span>, {article.publication.location}</span>
                    )}
                  </div>
                )}

                {/* Abstract */}
                <p className="article-abstract">
                  {article.abstract}
                </p>

                {/* Links Section */}
                <div className="article-links">
                  {/* PDF Link */}
                  {article.pdf_url && (
                    <a 
                      href={article.pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="article-link pdf-link"
                      onClick={() => articlesAPI.incrementDownloads(article.id)}
                    >
                      <FileText size={16} />
                      Download PDF
                    </a>
                  )}
                  
                  {/* External Link */}
                  {article.external_link && (
                    <a 
                      href={article.external_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="article-link external-link"
                    >
                      <ExternalLink size={16} />
                      View Publication
                    </a>
                  )}
                  
                  {/* Main Publication Link */}
                  {article.publication?.url && (
                    <a 
                      href={article.publication.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="article-link main-link"
                    >
                      <ExternalLink size={16} />
                      View Article
                    </a>
                  )}
                  
                  {/* DOI Link */}
                  {article.publication?.doi && (
                    <a 
                      href={`https://doi.org/${article.publication.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="article-link doi-link"
                    >
                      <ExternalLink size={16} />
                      DOI
                    </a>
                  )}
                </div>

                {/* Tags */}
                <div className="article-footer">
                  <div className="article-tags">
                    {article.tags?.slice(0, 5).map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                    {article.tags && article.tags.length > 5 && (
                      <span className="tag more-tags">
                        +{article.tags.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;
