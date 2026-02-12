export interface Issue {
  id: number;
  githubIssueId: number;
  repoName: string;
  issueUrl: string;
  title: string;
  language: string | null;
  labels: string[] | null;
  createdAtGithub: string;
  updatedAtGithub: string;
  fetchedAt: string;
}
