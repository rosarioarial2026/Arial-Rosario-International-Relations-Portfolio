// src/pages/ResumeEditor.js - Admin Resume Manager
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, X, Upload, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ResumeEditor.css';

const ResumeEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State for each section
  const [personalInfo, setPersonalInfo] = useState({
    full_name: '',
    professional_title: '',
    email: '',
    phone: '',
    location: '',
    linkedin_url: ''
  });
  
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [pdfInfo, setPdfInfo] = useState(null);

  useEffect(() => {
    loadResumeData();
  }, []);

  const loadResumeData = async () => {
    try {
      setLoading(true);

      // Load personal info
      const { data: infoData } = await supabase
        .from('resume_info')
        .select('*')
        .single();
      
      if (infoData) setPersonalInfo(infoData);

      // Load education (ordered by display_order)
      const { data: eduData } = await supabase
        .from('resume_education')
        .select('*')
        .order('display_order', { ascending: true });
      setEducation(eduData || []);

      // Load experience (ordered by display_order)
      const { data: expData } = await supabase
        .from('resume_experience')
        .select('*')
        .order('display_order', { ascending: true });
      setExperience(expData || []);

      // Load skills
      const { data: skillsData } = await supabase
        .from('resume_skills')
        .select('*')
        .order('display_order');
      setSkills(skillsData || []);

      // Load interests
      const { data: interestsData } = await supabase
        .from('resume_interests')
        .select('*')
        .order('display_order');
      setInterests(interestsData || []);

      // Load PDF info
      const { data: pdfData } = await supabase
        .from('resume_pdf')
        .select('*')
        .order('uploaded_at', { ascending: false })
        .limit(1)
        .single();
      setPdfInfo(pdfData);

    } catch (error) {
      console.error('Error loading resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePersonalInfo = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('resume_info')
        .upsert(personalInfo);
      
      if (error) throw error;
      alert('Personal info saved!');
    } catch (error) {
      console.error('Error saving personal info:', error);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const saveAllData = async () => {
    try {
      setSaving(true);
      await savePersonalInfo();
      alert('All changes saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save some data');
    } finally {
      setSaving(false);
    }
  };

  // Education functions
  const addEducation = () => {
    setEducation([...education, {
      degree_title: '',
      institution: '',
      location: '',
      start_date: '',
      end_date: '',
      specialization: '',
      display_order: 0 // New entries go to top
    }]);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const saveEducation = async (index) => {
    try {
      const item = education[index];
      const { error } = await supabase
        .from('resume_education')
        .upsert(item);
      
      if (error) throw error;
      alert('Education saved!');
      loadResumeData();
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Failed to save');
    }
  };

  const deleteEducation = async (id, index) => {
    if (!window.confirm('Delete this education entry?')) return;
    
    try {
      if (id) {
        const { error } = await supabase
          .from('resume_education')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      }
      
      const updated = education.filter((_, i) => i !== index);
      setEducation(updated);
      alert('Deleted!');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete');
    }
  };

  // Experience functions
  const addExperience = () => {
    setExperience([...experience, {
      position_title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      description: '',
      responsibilities: [],
      display_order: 0 // New entries go to top
    }]);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const addResponsibility = (index) => {
    const updated = [...experience];
    if (!updated[index].responsibilities) {
      updated[index].responsibilities = [];
    }
    updated[index].responsibilities.push('');
    setExperience(updated);
  };

  const updateResponsibility = (expIndex, respIndex, value) => {
    const updated = [...experience];
    updated[expIndex].responsibilities[respIndex] = value;
    setExperience(updated);
  };

  const deleteResponsibility = (expIndex, respIndex) => {
    const updated = [...experience];
    updated[expIndex].responsibilities.splice(respIndex, 1);
    setExperience(updated);
  };

  const saveExperience = async (index) => {
    try {
      const item = experience[index];
      const { error } = await supabase
        .from('resume_experience')
        .upsert(item);
      
      if (error) throw error;
      alert('Experience saved!');
      loadResumeData();
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save');
    }
  };

  const deleteExperience = async (id, index) => {
    if (!window.confirm('Delete this experience entry?')) return;
    
    try {
      if (id) {
        const { error } = await supabase
          .from('resume_experience')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      }
      
      const updated = experience.filter((_, i) => i !== index);
      setExperience(updated);
      alert('Deleted!');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="resume-editor">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading resume data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-editor">
      {/* Header */}
      <div className="editor-header">
        <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1>Resume Editor</h1>
        <div className="editor-actions">
          <button
            onClick={saveAllData}
            disabled={saving}
            className="btn btn-primary"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      <div className="editor-container">
        {/* Personal Info Section */}
        <section className="editor-section">
          <div className="section-header">
            <h2>Personal Information</h2>
            <button onClick={savePersonalInfo} className="btn btn-small" disabled={saving}>
              <Save size={16} /> Save
            </button>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={personalInfo.full_name}
                onChange={(e) => setPersonalInfo({...personalInfo, full_name: e.target.value})}
                placeholder="Ariel Rosario"
              />
            </div>
            
            <div className="form-group">
              <label>Professional Title</label>
              <input
                type="text"
                value={personalInfo.professional_title}
                onChange={(e) => setPersonalInfo({...personalInfo, professional_title: e.target.value})}
                placeholder="International Relations Specialist"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                placeholder="email@example.com"
              />
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                placeholder="+1 (123) 456-7890"
              />
            </div>
            
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={personalInfo.location}
                onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                placeholder="City, State, Country"
              />
            </div>
            
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input
                type="url"
                value={personalInfo.linkedin_url}
                onChange={(e) => setPersonalInfo({...personalInfo, linkedin_url: e.target.value})}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="editor-section">
          <div className="section-header">
            <h2>Education ({education.length})</h2>
            <button onClick={addEducation} className="btn btn-small">
              <Plus size={16} /> Add Education
            </button>
          </div>

          {education.map((edu, index) => (
            <div key={index} className="item-card">
              <div className="item-header">
                <h3>Education #{index + 1}</h3>
                <div className="item-actions">
                  <button onClick={() => saveEducation(index)} className="btn btn-small">
                    <Save size={14} /> Save
                  </button>
                  <button onClick={() => deleteEducation(edu.id, index)} className="btn btn-small btn-danger">
                    <X size={14} /> Delete
                  </button>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Degree Title *</label>
                  <input
                    type="text"
                    value={edu.degree_title}
                    onChange={(e) => updateEducation(index, 'degree_title', e.target.value)}
                    placeholder="Master of International Affairs"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Institution *</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    placeholder="UC San Diego"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={edu.location || ''}
                    onChange={(e) => updateEducation(index, 'location', e.target.value)}
                    placeholder="San Diego, CA"
                  />
                </div>

                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="text"
                    value={edu.start_date || ''}
                    onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                    placeholder="September 2024"
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="text"
                    value={edu.end_date || ''}
                    onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                    placeholder="June 2026"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Specialization / Details</label>
                  <textarea
                    value={edu.specialization || ''}
                    onChange={(e) => updateEducation(index, 'specialization', e.target.value)}
                    placeholder="Concentration, coursework, honors, etc."
                    rows="3"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Experience Section */}
        <section className="editor-section">
          <div className="section-header">
            <h2>Professional Experience ({experience.length})</h2>
            <button onClick={addExperience} className="btn btn-small">
              <Plus size={16} /> Add Experience
            </button>
          </div>

          {experience.map((exp, index) => (
            <div key={index} className="item-card">
              <div className="item-header">
                <h3>Experience #{index + 1}</h3>
                <div className="item-actions">
                  <button onClick={() => saveExperience(index)} className="btn btn-small">
                    <Save size={14} /> Save
                  </button>
                  <button onClick={() => deleteExperience(exp.id, index)} className="btn btn-small btn-danger">
                    <X size={14} /> Delete
                  </button>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Position Title *</label>
                  <input
                    type="text"
                    value={exp.position_title}
                    onChange={(e) => updateExperience(index, 'position_title', e.target.value)}
                    placeholder="Assistant Manager"
                  />
                </div>

                <div className="form-group">
                  <label>Company *</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={exp.location || ''}
                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>

                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="text"
                    value={exp.start_date || ''}
                    onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                    placeholder="June 2020"
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="text"
                    value={exp.end_date || ''}
                    onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                    placeholder="Present"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    value={exp.description || ''}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    placeholder="Brief description of role"
                    rows="2"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Responsibilities</label>
                  <button 
                    type="button"
                    onClick={() => addResponsibility(index)} 
                    className="btn btn-small"
                    style={{marginBottom: '0.5rem'}}
                  >
                    <Plus size={14} /> Add Bullet Point
                  </button>

                  {exp.responsibilities && exp.responsibilities.map((resp, respIndex) => (
                    <div key={respIndex} className="responsibility-item">
                      <textarea
                        value={resp}
                        onChange={(e) => updateResponsibility(index, respIndex, e.target.value)}
                        placeholder="• Responsibility or achievement..."
                        rows="2"
                      />
                      <button
                        type="button"
                        onClick={() => deleteResponsibility(index, respIndex)}
                        className="delete-resp-btn"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* PDF Upload Placeholder */}
        <section className="editor-section">
          <div className="section-header">
            <h2>Resume PDF</h2>
          </div>
          <div className="pdf-info">
            {pdfInfo ? (
              <div className="current-pdf">
                <FileText size={24} />
                <div>
                  <strong>{pdfInfo.filename}</strong>
                  <p>Uploaded: {new Date(pdfInfo.uploaded_at).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <p>No PDF uploaded yet</p>
            )}
            <p className="note">
              To update PDF: Upload new A_Rosario_Resume.pdf to public/documents/ folder
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResumeEditor;