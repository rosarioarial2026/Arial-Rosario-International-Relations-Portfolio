// src/pages/BlogEditor.js - WITH DEBUG LOGGING
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './BlogEditor.css';

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: 'Travel Stories',
    tags: [],
    location: '',
    read_time: 5,
    published: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const categories = [
    'Travel Stories',
    'Cultural Insights',
    'International Relations',
    'Personal Reflections',
    'Photography',
    'Food & Culture'
  ];

  // Quill editor modules (toolbar configuration)
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  // Quill formats
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image',
    'blockquote', 'code-block',
    'color', 'background'
  ];

  useEffect(() => {
    if (isEditMode) {
      loadBlog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      console.log('📥 Loaded blog from DB:', data);
      console.log('📥 Tags loaded:', data.tags);
      console.log('📥 Location loaded:', data.location);
      
      setFormData(data);
    } catch (error) {
      console.error('Error loading blog:', error);
      alert('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'title') {
      setFormData({
        ...formData,
        title: value,
        slug: generateSlug(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  // Handle rich text editor content change
  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content: content,
    });
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      const newTags = [...formData.tags, tagInput.trim()];
      
      console.log('➕ Adding tag:', tagInput.trim());
      console.log('➕ New tags array:', newTags);
      
      setFormData({
        ...formData,
        tags: newTags,
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = formData.tags.filter(tag => tag !== tagToRemove);
    
    console.log('➖ Removing tag:', tagToRemove);
    console.log('➖ Remaining tags:', newTags);
    
    setFormData({
      ...formData,
      tags: newTags,
    });
  };

  const handleSave = async (publishNow = false) => {
    try {
      // Validation
      if (!formData.title || !formData.excerpt || !formData.content) {
        alert('Please fill in title, excerpt, and content');
        return;
      }

      setSaving(true);

      const blogData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.cover_image || null,
        category: formData.category,
        tags: formData.tags, // ← Explicitly include tags
        location: formData.location || null,
        read_time: parseInt(formData.read_time) || 5,
        published: publishNow,
        author: 'Arial Rosario',
      };

      // 🔍 DEBUG: Log what we're about to save
      console.log('💾 === ATTEMPTING TO SAVE ===');
      console.log('💾 Title:', blogData.title);
      console.log('💾 Tags:', blogData.tags);
      console.log('💾 Tags type:', typeof blogData.tags);
      console.log('💾 Tags is array?', Array.isArray(blogData.tags));
      console.log('💾 Tags length:', blogData.tags?.length);
      console.log('💾 Location:', blogData.location);
      console.log('💾 Full data:', JSON.stringify(blogData, null, 2));
      console.log('💾 ========================');

      let result;
      
      if (isEditMode) {
        // Update existing blog
        result = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', id)
          .select(); // ← Add .select() to get returned data

        console.log('✅ Update result:', result);
        
        if (result.error) throw result.error;
        
        console.log('✅ Blog updated! Saved data:', result.data);
        alert('Blog updated successfully!');
      } else {
        // Create new blog
        result = await supabase
          .from('blogs')
          .insert([blogData])
          .select(); // ← Add .select() to get returned data

        console.log('✅ Insert result:', result);
        
        if (result.error) throw result.error;
        
        console.log('✅ Blog created! Saved data:', result.data);
        alert('Blog created successfully!');
      }

      // 🔍 DEBUG: Verify what was saved
      if (result.data && result.data[0]) {
        console.log('🔍 === VERIFICATION ===');
        console.log('🔍 Tags in DB:', result.data[0].tags);
        console.log('🔍 Location in DB:', result.data[0].location);
        console.log('🔍 ==================');
      }

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('❌ Error saving blog:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error hint:', error.hint);
      console.error('❌ Full error:', JSON.stringify(error, null, 2));
      alert('Failed to save blog: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="blog-editor">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-editor">
      {/* Header */}
      <div className="editor-header">
        <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1>{isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
        <div className="editor-actions">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="btn btn-outline"
          >
            <Save size={20} />
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="btn btn-primary"
          >
            <Eye size={20} />
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Editor Form */}
      <div className="editor-container">
        <div className="editor-main">
          {/* Title */}
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title..."
              className="input-large"
              required
            />
          </div>

          {/* Slug */}
          <div className="form-group">
            <label>URL Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="url-friendly-slug"
              className="input-medium"
            />
            <small>Preview: /blogs/{formData.slug || 'your-slug'}</small>
          </div>

          {/* Excerpt */}
          <div className="form-group">
            <label>Excerpt *</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of the blog post..."
              rows="3"
              className="textarea"
              required
            />
          </div>

          {/* Content - Rich Text Editor */}
          <div className="form-group">
            <label>Content *</label>
            <div className="rich-editor-wrapper">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                placeholder="Write your blog content here... Use the toolbar above to format your text!"
              />
            </div>
            <small>
              Use the toolbar to format your text. No HTML knowledge needed!
            </small>
          </div>
        </div>

        {/* Sidebar */}
        <div className="editor-sidebar">
          {/* Cover Image */}
          <div className="sidebar-section">
            <h3>Cover Image</h3>
            <input
              type="url"
              name="cover_image"
              value={formData.cover_image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="input-small"
            />
            {formData.cover_image && (
              <div className="image-preview">
                <img src={formData.cover_image} alt="Cover preview" />
              </div>
            )}
          </div>

          {/* Category */}
          <div className="sidebar-section">
            <h3>Category *</h3>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags - WITH DEBUG INFO */}
          <div className="sidebar-section">
            <h3>Tags</h3>
            <form onSubmit={handleAddTag} className="tag-input-form">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                className="input-small"
              />
              <button type="submit" className="btn-small">Add</button>
            </form>
            
            {/* Current tags count */}
            <small style={{display: 'block', marginBottom: '0.5rem', color: '#6b7280'}}>
              {formData.tags.length} tag{formData.tags.length !== 1 ? 's' : ''} added
            </small>
            
            <div className="tags-list">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="sidebar-section">
            <h3>Location</h3>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Tokyo, Japan"
              className="input-small"
            />
            {formData.location && (
              <small style={{display: 'block', marginTop: '0.5rem', color: '#3b9c9c'}}>
                ✓ Location set: {formData.location}
              </small>
            )}
          </div>

          {/* Read Time */}
          <div className="sidebar-section">
            <h3>Read Time (minutes)</h3>
            <input
              type="number"
              name="read_time"
              value={formData.read_time}
              onChange={handleChange}
              min="1"
              max="60"
              className="input-small"
            />
          </div>

          {/* Publish Status */}
          <div className="sidebar-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
              />
              <span>Published</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;