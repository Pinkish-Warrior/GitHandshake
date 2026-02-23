import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("issues")
export class Issue {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 123456789 })
  @Column({ type: "bigint", unique: true })
  githubIssueId: number;

  @ApiProperty({ example: "facebook/react" })
  @Column({ length: 255 })
  repoName: string;

  @ApiProperty({ example: "https://github.com/facebook/react/issues/1" })
  @Column({ type: "text" })
  issueUrl: string;

  @ApiProperty({ example: "Fix typo in README" })
  @Column({ type: "text" })
  title: string;

  @ApiPropertyOptional({ example: "TypeScript", nullable: true })
  @Column({ type: "varchar", length: 100, nullable: true })
  language: string | null;

  @ApiPropertyOptional({ example: ["good first issue", "help wanted"], nullable: true })
  @Column({ type: "text", array: true, nullable: true, default: [] })
  labels: string[] | null;

  @ApiPropertyOptional({ example: "2024-01-01T00:00:00.000Z", nullable: true })
  @Column({ type: "timestamptz", nullable: true })
  createdAtGithub: Date;

  @ApiPropertyOptional({ example: "2024-06-01T00:00:00.000Z", nullable: true })
  @Column({ type: "timestamptz", nullable: true })
  updatedAtGithub: Date;

  @ApiProperty({ example: "2024-06-15T00:00:00.000Z" })
  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  fetchedAt: Date;
}
