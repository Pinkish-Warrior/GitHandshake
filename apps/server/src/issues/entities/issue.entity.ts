import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("issues")
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint", unique: true })
  githubIssueId: number;

  @Column({ length: 255 })
  repoOwner: string;

  @Column({ length: 255 })
  repoName: string;

  @Column({ type: "text" })
  issueUrl: string;

  @Column({ type: "text" })
  title: string;

  @Column({ length: 100, nullable: true })
  language: string | null;

  @Column({ type: "text", array: true, nullable: true })
  labels: string[] | null;

  @Column({ type: "timestamptz", nullable: true })
  createdAtGithub: Date;

  @Column({ type: "timestamptz", nullable: true })
  updatedAtGithub: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  fetchedAt: Date;
}
