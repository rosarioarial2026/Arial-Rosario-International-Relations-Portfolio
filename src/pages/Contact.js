import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin } from 'lucide-react';

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
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>Get In Touch</h1>
          <p style={{ fontSize: '1.1rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Interested in collaboration, consulting, or discussing international relations? I'd love to connect with you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Contact Information */}
          <div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>Contact Information</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'linear-gradient(135deg, #3b9c9c 0%, #5bb5b5 100%)', color: 'white', padding: '0.75rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(59, 156, 156, 0.3)' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0', fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>Email</h3>
                    <p style={{ margin: '0', color: '#6b7280' }}>arrosario@ucsd.edu</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'linear-gradient(135deg, #3b9c9c 0%, #5bb5b5 100%)', color: 'white', padding: '0.75rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(59, 156, 156, 0.3)' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0', fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>Phone</h3>
                    <p style={{ margin: '0', color: '#6b7280' }}>+1 (919) 396-2209</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'linear-gradient(135deg, #3b9c9c 0%, #5bb5b5 100%)', color: 'white', padding: '0.75rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(59, 156, 156, 0.3)' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0', fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>Location</h3>
                    <p style={{ margin: '0', color: '#6b7280' }}>La Jolla, California, USA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>Connect Online</h2>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a 
                  href="https://www.linkedin.com/in/arialrosario/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '50px', 
                    height: '50px', 
                    background: 'linear-gradient(135deg, #3b9c9c 0%, #5bb5b5 100%)', 
                    color: 'white', 
                    borderRadius: '10px', 
                    textDecoration: 'none',
                    transition: 'transform 0.3s ease',
                    boxShadow: '0 4px 6px rgba(59, 156, 156, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Linkedin size={24} />
                </a>
                
                <a 
                  href="https://github.com/arialrosario" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '50px', 
                    height: '50px', 
                    background: 'linear-gradient(135deg, #5bb5b5 0%, #7dcdcd 100%)', 
                    color: 'white', 
                    borderRadius: '10px', 
                    textDecoration: 'none',
                    transition: 'transform 0.3s ease',
                    boxShadow: '0 4px 6px rgba(91, 181, 181, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Github size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>Send a Message</h2>
            
            {/* Success/Error Messages */}
            {status === 'success' && (
              <div style={{ 
                background: '#d1fae5', 
                color: '#065f46', 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '1rem',
                border: '1px solid #10b981'
              }}>
                ✓ Message sent successfully! I'll get back to you soon.
              </div>
            )}
            
            {status === 'error' && (
              <div style={{ 
                background: '#fee2e2', 
                color: '#991b1b', 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '1rem',
                border: '1px solid #ef4444'
              }}>
                ✗ Failed to send message. Please try again or email directly.
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937' }}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b9c9c'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b9c9c'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937' }}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this regarding?"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b9c9c'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1f2937' }}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Your message here..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b9c9c'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #3b9c9c 0%, #5bb5b5 50%, #7dcdcd 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  opacity: isSubmitting ? 0.7 : 1,
                  boxShadow: isSubmitting ? 'none' : '0 4px 6px rgba(59, 156, 156, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 12px rgba(59, 156, 156, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px rgba(59, 156, 156, 0.3)';
                  }
                }}
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
