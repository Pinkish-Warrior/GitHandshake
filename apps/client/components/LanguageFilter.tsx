"use client";

import React from 'react';

interface LanguageFilterProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const LanguageFilter = ({ selectedLanguage, onSelectLanguage }: LanguageFilterProps) => {
  const languages = ['', 'JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'Ruby', 'Go'];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
