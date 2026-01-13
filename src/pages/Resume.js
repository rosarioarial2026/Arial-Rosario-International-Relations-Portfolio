import React from 'react';
import { Download, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import './Resume.css';

const Resume = () => {
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
          <div className="personal-info">
            <h1 className="full-name">Arial Rosario</h1>
            <h2 className="professional-title">International Relations Specialist</h2>
            
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>arial.rosario@example.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+1 (919) 396-2209</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>San Diego, California, USA</span>
              </div>
            </div>
          </div>

          {/* Education */}
          <section className="resume-section">
            <h3 className="section-title">Education</h3>
            
            <div className="education-item">
              <div className="education-header">
                <div className="education-details">
                  <h4 className="degree-title">Master of International Affairs</h4>
                  <p className="institution">School of Global Policy and Strategy (GPS), UC San Diego</p>
                </div>
                <span className="date-range">
                  <Calendar size={14} />
                  2024 - Present
                </span>
              </div>
              <p className="specialization">Focusing on international cooperation, policy analysis, and cross-cultural engagement</p>
            </div>

            <div className="education-item">
              <div className="education-header">
                <div className="education-details">
                  <h4 className="degree-title">Bachelor of Arts in International Relations</h4>
                  <p className="institution">[University Name]</p>
                </div>
                <span className="date-range">
                  <Calendar size={14} />
                  2018 - 2022
                </span>
              </div>
              <p className="specialization">Specialization: Global Affairs and Diplomacy</p>
            </div>
          </section>

          {/* Experience */}
          <section className="resume-section">
            <h3 className="section-title">Professional Experience</h3>
            
            <div className="experience-item">
              <div className="experience-header">
                <div className="experience-details">
                  <h4 className="position-title">International Relations Analyst</h4>
                  <p className="company">[Organization Name]</p>
                </div>
                <span className="date-range">
                  <Calendar size={14} />
                  2022 - 2024
                </span>
              </div>
              <div className="job-description">
                <ul className="job-responsibilities">
                  <li>
                    <strong>Policy Analysis:</strong> Conducted comprehensive research and analysis on international policy initiatives, 
                    supporting strategic decision-making and stakeholder engagement.
                  </li>
                  <li>
                    <strong>Cross-Cultural Communication:</strong> Facilitated diplomatic exchanges and built relationships with international 
                    partners across 8+ countries, enhancing collaborative efforts.
                  </li>
                  <li>
                    <strong>Project Management:</strong> Coordinated multiple international cooperation projects, ensuring timely delivery 
                    and alignment with organizational goals and partner expectations.
                  </li>
                </ul>
              </div>
            </div>

            <div className="experience-item">
              <div className="experience-header">
                <div className="experience-details">
                  <h4 className="position-title">Travel Writer & Content Creator</h4>
                  <p className="company">Personal Blog & Publications</p>
                </div>
                <span className="date-range">
                  <Calendar size={14} />
                  2020 - Present
                </span>
              </div>
              <div className="job-description">
                <ul className="job-responsibilities">
                  <li>
                    <strong>Cultural Storytelling:</strong> Document authentic travel experiences and local stories from diverse global 
                    communities, promoting cross-cultural understanding through engaging narratives.
                  </li>
                  <li>
                    <strong>Content Development:</strong> Create compelling written and visual content that highlights cultural diversity, 
                    local perspectives, and human-centered stories from around the world.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="resume-section">
            <h3 className="section-title">Core Competencies</h3>
            
            <div className="skills-grid">
              <div className="skill-category">
                <h4 className="skill-category-title">Policy & Analysis</h4>
                <p className="skill-list">International Policy Analysis, Strategic Planning, Research & Writing</p>
              </div>
              <div className="skill-category">
                <h4 className="skill-category-title">Diplomacy & Communication</h4>
                <p className="skill-list">Cross-Cultural Relations, Stakeholder Engagement, Diplomatic Communication</p>
              </div>
              <div className="skill-category">
                <h4 className="skill-category-title">Languages</h4>
                <p className="skill-list">English (Native), Spanish (Proficient), [Other Languages]</p>
              </div>
              <div className="skill-category">
                <h4 className="skill-category-title">Content Creation</h4>
                <p className="skill-list">Travel Writing, Cultural Storytelling, Digital Media, Blog Management</p>
              </div>
            </div>
          </section>

          {/* Areas of Interest */}
          <section className="resume-section">
            <h3 className="section-title">Areas of Interest</h3>
            <div className="research-interests">
              <span className="research-tag">International Cooperation</span>
              <span className="research-tag">Diplomatic Relations</span>
              <span className="research-tag">Cultural Exchange</span>
              <span className="research-tag">Policy Development</span>
              <span className="research-tag">Global Affairs</span>
              <span className="research-tag">Travel & Cultural Storytelling</span>
              <span className="research-tag">Sustainable Development</span>
              <span className="research-tag">Human Rights</span>
            </div>
          </section>

          {/* Note */}
          <section className="resume-section">
            <div className="resume-note">
              <p style={{ fontStyle: 'italic', color: '#666', textAlign: 'center' }}>
                Detailed resume with full professional history available upon request
              </p>
            </div>
          </section>
        </div>

        {/* Download Button */}
        <div className="download-section">
          <button 
            className="download-btn"
            onClick={() => alert('Full resume download coming soon!')}
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