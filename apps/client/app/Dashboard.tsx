"use client";
import React, { useState, useEffect } from 'react';
import IssueList from '../components/IssueList';
import LanguageFilter from '../components/LanguageFilter';
import LoginButton from '../components/LoginButton';
import { Issue } from '../types';

const Dashboard = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError(null);
      let url = `/api/issues`;
      if (selectedLanguage) {
        url += `?language=${encodeURIComponent(selectedLanguage)}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok. Is the server running?');
        }
        const data = await response.json();
        setIssues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [selectedLanguage]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-hero">
        <div className="hero-overlay">
          <h1>GitHandshake</h1>
          <LoginButton />
          <p className="hero-subtitle">Discover good first issues across open source</p>
        </div>
      </header>
      <div className="dashboard-main">
        <aside className="filters-sidebar">
          <LanguageFilter
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
          />
        </aside>
        <main className="issues-content">
          {loading && <p>Loading issues...</p>}
          {error && <p>Error fetching issues: {error}</p>}
          {!loading && !error && issues.length > 0 && (
            <IssueList issues={issues} />
          )}
          {!loading && !error && issues.length === 0 && (
            <p>No issues found. Try selecting a different language or check if the database is seeded.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
