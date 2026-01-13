import React from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:arrosario@ucsd.edu',
      color: '#3b9c9c'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/arialrosario/',
      color: '#5bb5b5'
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/rosarioarial2026/',
      color: '#7dcdcd'
    },
    {
      name: 'Blog',
      icon: Globe,
      href: '/blogs',
      color: '#3b9c9c'
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-title">About</h3>
            <p className="footer-text">
              International Relations Specialist passionate about global diplomacy, 
              cross-cultural communication, and telling authentic stories from around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/articles">Research & Projects</a></li>
              <li><a href="/blogs">Travel Stories</a></li>
              <li><a href="/resume">Resume</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* Areas of Focus */}
          <div className="footer-section">
            <h3 className="footer-title">Areas of Focus</h3>
            <ul className="footer-links">
              <li>International Relations</li>
              <li>Policy Analysis</li>
              <li>Cultural Diplomacy</li>
              <li>Travel & Storytelling</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-section">
            <h3 className="footer-title">Connect</h3>
            <div className="social-links">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="social-link"
                    aria-label={link.name}
                    target={link.href.startsWith('/') ? '_self' : '_blank'}
                    rel={link.href.startsWith('/') ? '' : 'noopener noreferrer'}
                    style={{ '--hover-color': link.color }}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-copyright">
            <p>© {currentYear} Arial Rosario. All rights reserved.</p>
            <p className="footer-built">
              International Relations Specialist | UC San Diego GPS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
