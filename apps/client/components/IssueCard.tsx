import React from 'react';
import { Issue } from '../types';

interface IssueCardProps {
  issue: Issue;
}

const IssueCard = ({ issue }: IssueCardProps) => {
  const { title, language, labels, issueUrl } = issue;

  return (
    <div className="issue-card">
      <h3>
        <a href={issueUrl} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h3>
      <div className="issue-meta">
        <div className="issue-details-left">
          <span>Language: {language}</span>
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
