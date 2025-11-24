import React from 'react';

const IssueCard = ({ issue }) => {
  const { title, language, labels, issueUrl, description } = issue;

  return (
    <div className="issue-card">
      <h3>
        <a href={issueUrl} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h3>
      <p>{description}</p>
      <div className="issue-meta">
        <div className="issue-details-left"> {/* New wrapper for left-aligned details */}
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