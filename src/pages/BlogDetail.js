// src/pages/BlogDetail.js - Updated with better data handling
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Share2, Eye, Tag } from 'lucide-react';
import { blogsAPI } from '../lib/supabase';
import Comments from '../components/Comments';
import './BlogDetail.css';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const data = await blogsAPI.getBySlug(slug);
      
      // Debug: Log the data to console
      console.log('Blog data:', data);
      console.log('Tags:', data?.tags);
      console.log('Location:', data?.location);
      
      setBlog(data);
      setError(null);
    } catch (err) {
      console.error('Error loading blog:', err);
      setError('Blog post not found');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = blog?.title || 'Check out this blog post';

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-page">
        <div className="error-state">
          <h2>Blog Not Found</h2>
          <p>{error || 'The blog post you\'re looking for doesn\'t exist.'}</p>
          <Link to="/blogs" className="back-link">
            <ArrowLeft size={20} />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  // Ensure tags is an array
  const tagsArray = Array.isArray(blog.tags) 
    ? blog.tags 
    : (typeof blog.tags === 'string' 
      ? blog.tags.split(',').map(t => t.trim()).filter(Boolean)
      : []);

  return (
    <div className="blog-detail-page">
      {/* Back Button */}
      <div className="blog-header-nav">
        <Link to="/blogs" className="back-link">
          <ArrowLeft size={20} />
          Back to Blogs
        </Link>
      </div>

      {/* Blog Content */}
      <article className="blog-article">
        {/* Cover Image */}
        {blog.cover_image && (
          <div className="blog-cover">
            <img src={blog.cover_image} alt={blog.title} />
          </div>
        )}

        {/* Title and Meta */}
        <div className="blog-header">
          <h1 className="blog-title">{blog.title}</h1>
          
          <div className="blog-meta">
            <span className="meta-item">
              <Calendar size={16} />
              {new Date(blog.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            
            {blog.location && blog.location.trim() && (
              <span className="meta-item location">
                <MapPin size={16} />
                {blog.location}
              </span>
            )}
            
            <span className="meta-item">
              <Clock size={16} />
              {blog.read_time || 5} min read
            </span>

            <span className="meta-item">
              <Eye size={16} />
              {blog.views || 0} views
            </span>

            <button onClick={handleShare} className="share-btn">
              <Share2 size={16} />
              Share
            </button>
          </div>

          {/* Category Badge */}
          {blog.category && (
            <div className="blog-category">
              <span className="category-badge">{blog.category}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags Section - More Prominent */}
        {tagsArray && tagsArray.length > 0 && (
          <div className="blog-tags-section">
            <div className="tags-header">
              <Tag size={20} />
              <h3>Tags</h3>
            </div>
            <div className="tags-list">
              {tagsArray.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Location Section - If Not Shown Above */}
        {blog.location && blog.location.trim() && (
          <div className="blog-location-section">
            <div className="location-header">
              <MapPin size={20} />
              <h3>Location</h3>
            </div>
            <p className="location-text">{blog.location}</p>
          </div>
        )}

        {/* Author */}
        <div className="blog-author">
          <div className="author-info">
            <h3>{blog.author || 'Arial Rosario'}</h3>
            <p>International Relations Specialist & Travel Writer</p>
          </div>
        </div>
        {/* Comments Section */}
        <Comments blogId={blog.id} />
      </article>
    </div>
  );
};

export default BlogDetail;
