import React from 'react';
import './PageBanner.css';

const PageBanner = ({ icon: Icon, title, subtitle, stats = [] }) => {
  return (
    <div className="page-banner">
      <div className="banner-content">
        <div className="banner-text">
          <h1>
            {Icon && <Icon className="banner-icon" />}
            {title}
          </h1>
          <p>{subtitle}</p>
        </div>
        {stats.length > 0 && (
          <div className="banner-stats">
            {stats.map((stat, index) => (
              <div key={index} className="banner-stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageBanner;