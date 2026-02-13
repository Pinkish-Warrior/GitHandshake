import React from 'react';
import { Issue } from '../types';

interface IssueCardProps {
  issue: Issue;
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

const IssueCard = ({ issue }: IssueCardProps) => {
  const { title, language, labels, issueUrl } = issue;
  const langKey = language?.toLowerCase() ?? '';
  const iconClass = LANGUAGE_ICONS[langKey];

  return (
    <div className="issue-card" data-language={langKey || undefined}>
      <h3>
        <a href={issueUrl} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h3>
      <div className="issue-meta">
        <div className="issue-details-left">
          <span className="language-badge">
            {iconClass && <i className={iconClass}></i>}
            {language}
          </span>
          {labels && labels.length > 0 && (
            <span>Labels: {labels.join(', ')}</span>
          )}
        </div>
        <a href={issueUrl} target="_blank" rel="noopener noreferrer" className="view-issue-link">View Issue</a>
      </div>
    </div>
  );
};

export default IssueCard;
