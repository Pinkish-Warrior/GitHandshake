"use client";
import React from 'react';
import IssueList from '../components/IssueList';
import LanguageFilter from '../components/LanguageFilter';
import LoginButton from '../components/LoginButton';

const Dashboard = () => {
  // Mock data for demonstration purposes
  const mockIssues = [
    { id: 1, title: 'Fix bug in login flow', description: 'Users are unable to log in with valid credentials.', language: 'JavaScript', stars: 10, comments: 5, url: '#' },
    { id: 2, title: 'Add dark mode feature', description: 'Implement a theme switcher for dark mode.', language: 'TypeScript', stars: 25, comments: 12, url: '#' },
    { id: 3, title: 'Improve database query performance', description: 'Optimize slow queries on the user table.', language: 'Go', stars: 50, comments: 23, url: '#' }
  ];

  const handleLanguageSelect = (language) => {
    // Placeholder for language filter logic
    if (language) {
      alert(`Filtering by language: ${language}`);
    } else {
      alert('Showing all languages');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>GitHub Issues Dashboard</h1>
        <LoginButton />
      </header>
      <div className="filters-section">
        <LanguageFilter onSelectLanguage={handleLanguageSelect} />
      </div>
      <div className="issues-section">
        <IssueList issues={mockIssues} />
      </div>
    </div>
  );
};

export default Dashboard;