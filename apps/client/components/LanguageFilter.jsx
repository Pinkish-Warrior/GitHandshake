"use client"; //Stop rendering this component on the server

import React, { useState } from 'react';

const LanguageFilter = ({ onSelectLanguage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const languages = ['All', 'JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'Ruby', 'Go']; // Example languages

  const handleChange = (event) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    if (onSelectLanguage) {
      onSelectLanguage(language === 'All' ? null : language);
    }
  };

  return (
    <div className="language-filter">
      <label htmlFor="language-select">Filter by Language:</label>
      <select id="language-select" value={selectedLanguage} onChange={handleChange}>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageFilter;
