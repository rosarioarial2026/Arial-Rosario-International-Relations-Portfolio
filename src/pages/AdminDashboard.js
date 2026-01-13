// src/pages/AdminDashboard.js - Delete-only comments (no approval)
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, LogOut, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('blogs'); // 'blogs' or 'comments'

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'rosarioarial2026@gmail.com') {
      navigate('/login');
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadBlogs(), loadComments()]);
    setLoading(false);
  };

  const loadBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error loading blogs:', error);
    }
  };

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          *,
          blogs (
            title,
            slug
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadBlogs();
      alert('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      loadBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog status');
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadComments();
      alert('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <div className="admin-actions">
            <Link to="/admin/blog/new" className="btn btn-primary">
              <Plus size={20} />
              New Blog Post
            </Link>
            <button onClick={handleLogout} className="btn btn-outline">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'blogs' ? 'active' : ''}`}
          onClick={() => setActiveTab('blogs')}
        >
          Blog Posts ({blogs.length})
        </button>
        <button
          className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          Comments ({comments.length})
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {activeTab === 'blogs' && (
          <div className="blogs-section">
            <h2>All Blog Posts</h2>
            <div className="blogs-table">
              {blogs.length === 0 ? (
                <div className="empty-state">
                  <p>No blog posts yet. Create your first one!</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.id}>
                        <td className="blog-title-cell">
                          <Link to={`/blogs/${blog.slug}`} target="_blank">
                            {blog.title}
                          </Link>
                        </td>
                        <td>{blog.category}</td>
                        <td>
                          <button
                            className={`status-badge ${blog.published ? 'published' : 'draft'}`}
                            onClick={() => handleTogglePublish(blog.id, blog.published)}
                          >
                            {blog.published ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td>
                          <Eye size={16} /> {blog.views || 0}
                        </td>
                        <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                        <td className="actions-cell">
                          <Link
                            to={`/admin/blog/edit/${blog.id}`}
                            className="action-btn edit"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="action-btn delete"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="comments-section">
            <h2>All Comments</h2>
            <div className="comments-list">
              {comments.length === 0 ? (
                <div className="empty-state">
                  <p>No comments yet.</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-header">
                      <div className="comment-info">
                        <strong>{comment.author_name}</strong>
                        <span className="comment-email">{comment.author_email}</span>
                        <span className="comment-date">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="comment-blog">
                        on "{comment.blogs?.title}"
                      </div>
                    </div>
                    <p className="comment-text">{comment.comment_text}</p>
                    <div className="comment-actions">
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="btn btn-danger"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;