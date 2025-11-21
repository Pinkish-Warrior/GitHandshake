import React from 'react';

const IssueCard = ({ issue }) => {
  return (
    <div className="issue-card">
      <h3>{issue.title}</h3>
      <p>{issue.description}</p>
      <div className="issue-meta">
        <span>Language: {issue.language}</span>
        <span>Stars: {issue.stars}</span>
        <span>Comments: {issue.comments}</span>
      </div>
      <a href={issue.url} target="_blank" rel="noopener noreferrer">View Issue</a>
    </div>
  );
};

export default IssueCard;
