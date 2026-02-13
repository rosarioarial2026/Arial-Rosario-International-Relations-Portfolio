// src/pages/ArticleDetail.js
// UPDATED: Fixed slug bug + Supabase integration
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Users, Download, Eye, FileText } from 'lucide-react';
import { articlesAPI } from '../lib/supabase';
import './ArticleDetail.css';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await articlesAPI.getBySlug(slug);
        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err.message || 'Article not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="article-detail-page">
        <div className="container">
          <div className="loading-state">
            <p>Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>Article Not Found</h2>
            <p>{error}</p>
            <Link to="/articles" className="back-link">
              <ArrowLeft size={20} />
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>Article Not Found</h2>
            <p>The requested article could not be found.</p>
            <Link to="/articles" className="back-link">
              <ArrowLeft size={20} />
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <div className="container">
        {/* Navigation */}
        <div className="article-nav">
          <Link to="/articles" className="back-link">
            <ArrowLeft size={20} />
            Back to Articles
          </Link>
        </div>

        {/* Cover Image */}
        {article.cover_image && (
          <div className="article-detail-cover">
            <img src={article.cover_image} alt={article.title} />
          </div>
        )}

        {/* Article Header */}
        <div className="article-header">
          <div className="article-meta">
            <span className={`article-status status-${article.status}`}>
              {article.status?.replace('_', ' ')}
            </span>
            <span className="article-type">
              {article.type?.replace('_', ' ')}
            </span>
            {article.featured && (
              <span className="featured-badge">Featured</span>
            )}
          </div>

          <h1 className="article-title">{article.title}</h1>

          {/* Authors */}
          <div className="article-authors">
            <Users size={16} />
            <span>
              {article.authors?.map((author, index) => (
                <span key={index}>
                  {author.name}
                  {author.isMainAuthor && ' *'}
                  {index < article.authors.length - 1 && ', '}
                </span>
              ))}
            </span>
          </div>

          {/* Publication Info */}
          {article.publication && (
            <div className="publication-info">
              <Calendar size={16} />
              <span>
                {article.publication.journal && (
                  <strong>{article.publication.journal}</strong>
                )}
                {article.publication.year && (
                  <span> ({article.publication.year})</span>
                )}
                {article.publication.volume && (
                  <span>, Vol. {article.publication.volume}</span>
                )}
                {article.publication.pages && (
                  <span>, pp. {article.publication.pages}</span>
                )}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="article-stats">
            <div className="stat">
              <Eye size={16} />
              <span>{article.views || 0} views</span>
            </div>
            <div className="stat">
              <Download size={16} />
              <span>{article.downloads || 0} downloads</span>
            </div>
          </div>
        </div>

        {/* PROMINENT FULL PAPER ACCESS SECTION */}
        {(article.publication?.url || article.publication?.doi || (article.links && article.links.length > 0)) && (
          <div className="full-paper-access">
            <div className="full-paper-header">
              <FileText size={24} />
              <h2>📄 Access Full Research Paper</h2>
            </div>
            
            <div className="full-paper-buttons">
              {article.publication?.url && (
                
                  href={article.publication.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="full-paper-button primary"
                >
                  <ExternalLink size={20} />
                  View Complete Paper (PDF)
                </a>
              )}
              
              {article.publication?.doi && (
                
                  href={`https://doi.org/${article.publication.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="full-paper-button doi"
                >
                  <ExternalLink size={16} />
                  DOI: {article.publication.doi}
                </a>
              )}

              {article.links?.map((link, index) => (
                
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="full-paper-button secondary"
                >
                  <ExternalLink size={16} />
                  {link.description}
                </a>
              ))}
            </div>
            
            <p className="full-paper-note">
              💡 Click above to access the complete research paper with full methodology, results, and analysis.
            </p>
          </div>
        )}

        {/* Article Content */}
        <div className="article-content">
          {/* Abstract */}
          <div className="article-section">
            <h2>Abstract</h2>
            <div 
              className="article-abstract"
              dangerouslySetInnerHTML={{ __html: article.abstract }}
            />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="article-section">
              <h2>Keywords</h2>
              <div className="article-tags">
                {article.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Summary/Content */}
          {article.content && (
            <div className="article-section">
              <h2>Research Summary</h2>
              <div className="article-full-content">
                <p>{article.content}</p>
              </div>
            </div>
          )}

          {/* Additional Resources */}
          {(article.publication?.url || article.publication?.doi || (article.links && article.links.length > 0)) && (
            <div className="article-section additional-resources">
              <h2>Additional Resources</h2>
              <div className="article-links">
                {article.publication?.url && (
                  
                    href={article.publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-link primary"
                  >
                    <ExternalLink size={16} />
                    View Article
                  </a>
                )}
                
                {article.publication?.doi && (
                  
                    href={`https://doi.org/${article.publication.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-link doi"
                  >
                    <ExternalLink size={16} />
                    DOI: {article.publication.doi}
                  </a>
                )}

                {article.links?.map((link, index) => (
                  
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`article-link ${link.type}`}
                  >
                    <ExternalLink size={16} />
                    {link.description}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;