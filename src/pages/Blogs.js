import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowRight, Search, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Blogs.css';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Travel Stories',
    'Cultural Insights',
    'International Relations',
    'Personal Reflections',
    'Photography',
    'Food & Culture'
  ];

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [searchTerm, selectedCategory, blogs]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, excerpt, cover_image, category, tags, author, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error loading blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = [...blogs];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBlogs(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="blogs-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="header-icon">
            <Globe size={48} />
          </div>
          <h1 className="page-title">Travel Stories & Reflections</h1>
          <p className="page-subtitle">
            Authentic stories from around the world, exploring diverse cultures, 
            traditions, and the human connections that bridge our differences
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'story' : 'stories'} 
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading stories...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="empty-state">
            <Globe size={64} style={{ opacity: 0.3 }} />
            <h3>No stories found</h3>
            <p>
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filters' 
                : 'Check back soon for new travel stories!'}
            </p>
          </div>
        ) : (
          <div className="blogs-grid">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="blog-card">
                {blog.cover_image && (
                  <div className="blog-image">
                    <img src={blog.cover_image} alt={blog.title} />
                    <div className="blog-category-badge">{blog.category}</div>
                  </div>
                )}
                
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="meta-item">
                      <Calendar size={14} />
                      {formatDate(blog.created_at)}
                    </span>
                    <span className="meta-item">
                      <User size={14} />
                      {blog.author || 'Ariel Rosario'}
                    </span>
                  </div>

                  <h2 className="blog-title">
                    <Link to={`/blogs/${blog.slug}`}>
                      {blog.title}
                    </Link>
                  </h2>

                  <p className="blog-excerpt">{blog.excerpt}</p>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="blog-tags">
                      <Tag size={14} />
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <Link to={`/blogs/${blog.slug}`} className="read-more">
                    Read Story <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Coming Soon Section */}
        {!loading && filteredBlogs.length > 0 && (
          <div className="coming-soon-section">
            <h3>More Stories Coming Soon</h3>
            <p>
              I'm continuously documenting my travels and cultural encounters. 
              Subscribe to stay updated with new stories from around the world!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;