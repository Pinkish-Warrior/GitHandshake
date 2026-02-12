import React from 'react';
import IssueCard from './IssueCard';
import { Issue } from '../types';

interface IssueListProps {
  issues: Issue[];
}

const IssueList = ({ issues }: IssueListProps) => {
  return (
    <div className="issue-list">
      {issues.map(issue => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
};

export default IssueList;
