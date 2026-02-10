import React, { useState, useEffect } from 'react';
import { Download, Mail, Phone, MapPin, Calendar, Linkedin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Resume.css';

const Resume = () => {
  const [loading, setLoading] = useState(true);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);

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
      setPersonalInfo(infoData);

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

    } catch (error) {
      console.error('Error loading resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.open('/documents/A_Rosario_Resume.pdf', '_blank');
  };

  if (loading) {
    return (
      <div className="resume-page">
        <div className="resume-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading resume...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-page">
      <div className="resume-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Resume</h1>
          <p className="page-subtitle">Education and professional experience</p>
        </div>

        {/* Resume Content */}
        <div className="resume-content">
          
          {/* Personal Info */}
          {personalInfo && (
            <div className="personal-info">
              <h1 className="full-name">{personalInfo.full_name}</h1>
              <h2 className="professional-title">{personalInfo.professional_title}</h2>
              
              <div className="contact-info">
                {personalInfo.email && (
                  <div className="contact-item">
                    <Mail size={16} />
                    <span>{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="contact-item">
                    <MapPin size={16} />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.linkedin_url && (
                  <div className="contact-item">
                    <Linkedin size={16} />
                    <a href={personalInfo.linkedin_url} target="_blank" rel="noopener noreferrer">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="resume-section">
              <h3 className="section-title">Education</h3>
              
              {education.map((edu) => (
                <div key={edu.id} className="education-item">
                  <div className="education-header">
                    <div className="education-details">
                      <h4 className="degree-title">{edu.degree_title}</h4>
                      <p className="institution">{edu.institution}</p>
                      {edu.location && <p className="location-text">{edu.location}</p>}
                    </div>
                    {(edu.start_date || edu.end_date) && (
                      <span className="date-range">
                        <Calendar size={14} />
                        {edu.start_date && edu.end_date ? `${edu.start_date} - ${edu.end_date}` : edu.end_date || edu.start_date}
                      </span>
                    )}
                  </div>
                  {edu.specialization && (
                    <p className="specialization">{edu.specialization}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="resume-section">
              <h3 className="section-title">Professional Experience</h3>
              
              {experience.map((exp) => (
                <div key={exp.id} className="experience-item">
                  <div className="experience-header">
                    <div className="experience-details">
                      <h4 className="position-title">{exp.position_title}</h4>
                      <p className="company">{exp.company}{exp.location && `, ${exp.location}`}</p>
                    </div>
                    {(exp.start_date || exp.end_date) && (
                      <span className="date-range">
                        <Calendar size={14} />
                        {exp.start_date && exp.end_date ? `${exp.start_date} - ${exp.end_date}` : exp.end_date || exp.start_date}
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="job-description-text">{exp.description}</p>
                  )}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="job-description">
                      <ul className="job-responsibilities">
                        {exp.responsibilities.map((resp, index) => (
                          <li key={index}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="resume-section">
              <h3 className="section-title">Additional Skills & Qualifications</h3>
              
              <div className="skills-grid">
                {skills.map((skill) => (
                  <div key={skill.id} className="skill-category">
                    <h4 className="skill-category-title">{skill.category}</h4>
                    <p className="skill-list">{skill.skills}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Areas of Interest */}
          {interests.length > 0 && (
            <section className="resume-section">
              <h3 className="section-title">Areas of Interest</h3>
              <div className="research-interests">
                {interests.map((interest) => (
                  <span key={interest.id} className="research-tag">{interest.interest}</span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Download Button */}
        <div className="download-section">
          <button 
            className="download-btn"
            onClick={handleDownload}
          >
            <Download size={20} />
            Download Full Resume (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resume;