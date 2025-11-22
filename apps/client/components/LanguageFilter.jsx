"use client";

import React from 'react';

const LanguageFilter = ({ selectedLanguage, onSelectLanguage }) => {
  const languages = ['', 'JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'Ruby', 'Go']; // Example languages

  const handleChange = (event) => {
    onSelectLanguage(event.target.value);
  };

  return (
    <div className="language-filter">
      <label htmlFor="language-select">Filter by Language:</label>
      <select id="language-select" value={selectedLanguage} onChange={handleChange}>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang === '' ? 'All Languages' : lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageFilter;