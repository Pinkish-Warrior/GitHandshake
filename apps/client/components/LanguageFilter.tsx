"use client";

import React from 'react';

interface LanguageFilterProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const LANGUAGE_ICONS: Record<string, string> = {
  javascript: 'devicon-javascript-plain',
  python: 'devicon-python-plain',
  typescript: 'devicon-typescript-plain',
  go: 'devicon-go-plain',
  java: 'devicon-java-plain',
  'c++': 'devicon-cplusplus-plain',
  ruby: 'devicon-ruby-plain',
  rust: 'devicon-rust-original',
};

const languages = ['JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'Ruby', 'Go', 'Rust'];

const LanguageFilter = ({ selectedLanguage, onSelectLanguage }: LanguageFilterProps) => {
  return (
    <div className="language-filter">
      <label>Filter by Language:</label>
      <ul className="language-filter-list">
        <li>
          <button
            className={`language-filter-item ${selectedLanguage === '' ? 'active' : ''}`}
            onClick={() => onSelectLanguage('')}
          >
            All Languages
          </button>
        </li>
        {languages.map((lang) => {
          const langKey = lang.toLowerCase();
          const iconClass = LANGUAGE_ICONS[langKey];
          return (
            <li key={lang}>
              <button
                className={`language-filter-item ${selectedLanguage === lang ? 'active' : ''}`}
                data-language={langKey}
                onClick={() => onSelectLanguage(lang)}
              >
                <span className="language-badge">
                  {iconClass && <i className={iconClass}></i>}
                  {lang}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LanguageFilter;
