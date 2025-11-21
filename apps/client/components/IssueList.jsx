import React from 'react';
import IssueCard from './IssueCard'; // Assuming IssueCard is in the same directory

const IssueList = ({ issues }) => {
  return (
    <div className="issue-list">
      {issues.map(issue => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
};

export default IssueList;
