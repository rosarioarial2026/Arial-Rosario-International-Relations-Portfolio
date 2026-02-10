import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('https://formspree.io/f/meeozzlj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-description">
            Interested in collaboration, consulting, or discussing international relations? I'd love to connect with you.
          </p>
        </div>

        <div className="contact-content">
          {/* Contact Information */}
          <div>
            <div className="contact-info-card">
              <h2 className="contact-info-title">Contact Information</h2>
              
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-icon">
                    <Mail size={20} />
                  </div>
                  <div className="contact-info-details">
                    <h3>Email</h3>
                    <p>arrosario@ucsd.edu</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <Phone size={20} />
                  </div>
                  <div className="contact-info-details">
                    <h3>Phone</h3>
                    <p>+1 (919) 396-2209</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="contact-info-details">
                    <h3>Location</h3>
                    <p>La Jolla, California, USA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-links-card">
              <h2 className="social-links-title">Connect Online</h2>
              
              <div className="social-links">
                <a 
                  href="https://www.linkedin.com/in/-ariel-rosario/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link linkedin"
                >
                  <Linkedin size={24} />
                </a>
                
                <a 
                  href="https://github.com/arialrosario" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link github"
                >
                  <Github size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-card">
            <h2 className="contact-form-title">Send a Message</h2>
            
            {/* Success/Error Messages */}
            {status === 'success' && (
              <div className="status-message success">
                ✓ Message sent successfully! I'll get back to you soon.
              </div>
            )}
            
            {status === 'error' && (
              <div className="status-message error">
                ✗ Failed to send message. Please try again or email directly.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this regarding?"
                  className="form-input"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message here..."
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                <Send size={20} />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;