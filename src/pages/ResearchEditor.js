// src/pages/ResearchEditor.js - Add/Edit Research Articles
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Eye, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ResearchEditor.css';

const ResearchEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    abstract: '',
    type: 'research_paper',
    authors: [{ name: 'Arial Rosario', affiliation: 'UC San Diego GPS' }],
    publication: {
      name: '',
      date: '',
      volume: '',
      issue: '',
      pages: ''
    },
    keywords: [],
    categories: [],
    tags: [],
    cover_image: '',
    pdf_url: '',
    external_link: '',
    featured: false,
    published: false,
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorAffiliation, setAuthorAffiliation] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const articleTypes = [
    { value: 'research_paper', label: 'Research Paper' },
    { value: 'policy_brief', label: 'Policy Brief' },
    { value: 'working_paper', label: 'Working Paper' },
    { value: 'conference_presentation', label: 'Conference Presentation' },
    { value: 'report', label: 'Report' },
    { value: 'thesis', label: 'Thesis' }
  ];

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
      loadArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('research_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setFormData(data);
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Failed to load article');
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
    } else if (name.startsWith('publication.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        publication: {
          ...formData.publication,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleAbstractChange = (content) => {
    setFormData({ ...formData, abstract: content });
  };

  // Authors
  const handleAddAuthor = (e) => {
    e.preventDefault();
    if (authorName.trim()) {
      setFormData({
        ...formData,
        authors: [
          ...formData.authors,
          { name: authorName.trim(), affiliation: authorAffiliation.trim() }
        ]
      });
      setAuthorName('');
      setAuthorAffiliation('');
    }
  };

  const handleRemoveAuthor = (index) => {
    setFormData({
      ...formData,
      authors: formData.authors.filter((_, i) => i !== index)
    });
  };

  // Keywords
  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  // Categories
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryInput.trim()]
      });
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (category) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(c => c !== category)
    });
  };

  // Tags
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSave = async (publishNow = false) => {
    try {
      if (!formData.title || !formData.abstract) {
        alert('Please fill in title and abstract');
        return;
      }

      setSaving(true);

      const articleData = {
        title: formData.title,
        slug: formData.slug,
        abstract: formData.abstract,
        type: formData.type,
        authors: formData.authors,
        publication: formData.publication,
        keywords: formData.keywords,
        categories: formData.categories,
        tags: formData.tags,
        cover_image: formData.cover_image || null,
        pdf_url: formData.pdf_url || null,
        external_link: formData.external_link || null,
        featured: formData.featured,
        published: publishNow,
      };

      console.log('💾 Saving research article:', articleData);

      if (isEditMode) {
        const { error } = await supabase
          .from('research_articles')
          .update(articleData)
          .eq('id', id);

        if (error) throw error;
        alert('Article updated successfully!');
      } else {
        const { error } = await supabase
          .from('research_articles')
          .insert([articleData]);

        if (error) throw error;
        alert('Article created successfully!');
      }

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="research-editor">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="research-editor">
      {/* Header */}
      <div className="editor-header">
        <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1>{isEditMode ? 'Edit Research Article' : 'Create New Research Article'}</h1>
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
              placeholder="Enter article title..."
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
            <small>Preview: /articles/{formData.slug || 'your-slug'}</small>
          </div>

          {/* Abstract */}
          <div className="form-group">
            <label>Abstract *</label>
            <div className="rich-editor-wrapper">
              <ReactQuill
                theme="snow"
                value={formData.abstract}
                onChange={handleAbstractChange}
                modules={modules}
                formats={formats}
                placeholder="Write your abstract here..."
              />
            </div>
          </div>

          {/* Authors */}
          <div className="form-group">
            <label>Authors *</label>
            <form onSubmit={handleAddAuthor} className="author-input-form">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author name"
                className="input-small"
              />
              <input
                type="text"
                value={authorAffiliation}
                onChange={(e) => setAuthorAffiliation(e.target.value)}
                placeholder="Affiliation (optional)"
                className="input-small"
              />
              <button type="submit" className="btn-small">
                <Plus size={16} /> Add
              </button>
            </form>
            <div className="authors-list">
              {formData.authors.map((author, index) => (
                <div key={index} className="author-item">
                  <div>
                    <strong>{author.name}</strong>
                    {author.affiliation && <span> - {author.affiliation}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAuthor(index)}
                    className="remove-btn"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="editor-sidebar">
          {/* Cover Image Section */}
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

          {/* Article Type */}
          <div className="sidebar-section">
            <h3>Article Type *</h3>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="select"
            >
              {articleTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Publication Info */}
          <div className="sidebar-section">
            <h3>Publication</h3>
            <input
              type="text"
              name="publication.name"
              value={formData.publication.name}
              onChange={handleChange}
              placeholder="Journal/Conference name"
              className="input-small"
            />
            <input
              type="text"
              name="publication.date"
              value={formData.publication.date}
              onChange={handleChange}
              placeholder="Publication date (e.g., 2024)"
              className="input-small"
              style={{marginTop: '0.5rem'}}
            />
            <input
              type="text"
              name="publication.volume"
              value={formData.publication.volume}
              onChange={handleChange}
              placeholder="Volume"
              className="input-small"
              style={{marginTop: '0.5rem'}}
            />
          </div>

          {/* Keywords */}
          <div className="sidebar-section">
            <h3>Keywords</h3>
            <form onSubmit={handleAddKeyword} className="tag-input-form">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Add keyword..."
                className="input-small"
              />
              <button type="submit" className="btn-small">Add</button>
            </form>
            <div className="tags-list">
              {formData.keywords.map((keyword, index) => (
                <span key={index} className="tag">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="sidebar-section">
            <h3>Categories</h3>
            <form onSubmit={handleAddCategory} className="tag-input-form">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                placeholder="Add category..."
                className="input-small"
              />
              <button type="submit" className="btn-small">Add</button>
            </form>
            <div className="tags-list">
              {formData.categories.map((category, index) => (
                <span key={index} className="tag">
                  {category}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="sidebar-section">
            <h3>Tags</h3>
            <form onSubmit={handleAddTag} className="tag-input-form">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag..."
                className="input-small"
              />
              <button type="submit" className="btn-small">Add</button>
            </form>
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

          {/* PDF URL */}
          <div className="sidebar-section">
            <h3>PDF URL</h3>
            <input
              type="url"
              name="pdf_url"
              value={formData.pdf_url}
              onChange={handleChange}
              placeholder="https://example.com/paper.pdf"
              className="input-small"
            />
          </div>

          {/* External Link */}
          <div className="sidebar-section">
            <h3>External Link</h3>
            <input
              type="url"
              name="external_link"
              value={formData.external_link}
              onChange={handleChange}
              placeholder="https://..."
              className="input-small"
            />
          </div>

          {/* Options */}
          <div className="sidebar-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <span>Featured Article</span>
            </label>
            <label className="checkbox-label" style={{marginTop: '0.5rem'}}>
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

export default ResearchEditor;