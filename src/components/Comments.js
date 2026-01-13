// src/components/Comments.js - Auto-approve comments
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Comments.css';

const Comments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    comment_text: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadComments();
  }, [blogId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('blog_id', blogId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.author_name || !formData.author_email || !formData.comment_text) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('blog_comments')
        .insert([{
          blog_id: blogId,
          author_name: formData.author_name.trim(),
          author_email: formData.author_email.trim(),
          comment_text: formData.comment_text.trim(),
          approved: true, // ← AUTO-APPROVED - Goes live immediately
        }]);

      if (error) throw error;

      // Clear form
      setFormData({
        author_name: '',
        author_email: '',
        comment_text: '',
      });

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      // Reload comments to show new one
      loadComments();

    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <MessageSquare size={24} />
        <h2>Comments ({comments.length})</h2>
      </div>

      {/* Existing Comments */}
      <div className="comments-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-avatar">
                <User size={24} />
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">{comment.author_name}</span>
                  <span className="comment-date">{formatDate(comment.created_at)}</span>
                </div>
                <p className="comment-text">{comment.comment_text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <div className="comment-form-container">
        <h3>Leave a Comment</h3>
        
        {showSuccess && (
          <div className="success-message">
            ✓ Comment posted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="comment-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="author_name">
                <User size={16} />
                Name *
              </label>
              <input
                id="author_name"
                type="text"
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="form-input"
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="author_email">
                <Mail size={16} />
                Email *
              </label>
              <input
                id="author_email"
                type="email"
                name="author_email"
                value={formData.author_email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="form-input"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comment_text">
              <MessageSquare size={16} />
              Comment *
            </label>
            <textarea
              id="comment_text"
              name="comment_text"
              value={formData.comment_text}
              onChange={handleChange}
              placeholder="Share your thoughts..."
              rows="4"
              required
              className="form-textarea"
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="submit-btn"
          >
            <Send size={20} />
            {submitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>

        <p className="form-note">
          Your email will not be published. Comments are posted immediately.
        </p>
      </div>
    </div>
  );
};

export default Comments;