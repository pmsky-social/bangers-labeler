import { CreateLabelData } from "@skyware/labeler";
import { bangerLabelFromScore } from "../../labeler";
import { BadScoreError } from "../../errors";

export class PublishedLabel {
  val!: string;
  uri!: string;
  cid?: string | undefined;
  neg?: number;
  src?: string | undefined;
  cts?: string | undefined;
  exp?: string | undefined;
  score!: string | number | bigint;

  constructor(
    partial: Partial<PublishedLabel> & {
      val: string;
      uri: string;
      score: string | number | bigint;
    }
  ) {
    Object.assign(this, partial);
  }

  static fromDbRow(
    row: {
      uri: string;
      score: string | number | bigint;
      publishedScore: string | number | bigint | null;
    } & Partial<PublishedLabel>
  ): PublishedLabel[] {
    if (isNaN(Number(row.score))) throw new BadScoreError(row.uri, row.score);
    if (!row.publishedScore && Number(row.score) > 0)
      return [
        new PublishedLabel({
          neg: 0,
          val: bangerLabelFromScore(row.score),
          uri: row.uri,
          score: row.score,
          cid: row.cid,
          src: row.src,
          cts: row.cts,
          exp: row.exp,
        }),
      ];
    if (row.publishedScore && row.score != row.publishedScore)
      return [
        new PublishedLabel({
          neg: 0,
          val: bangerLabelFromScore(row.score),
          uri: row.uri,
          score: row.score,
          cid: row.cid,
          src: row.src,
          cts: row.cts,
          exp: row.exp,
        }),
        new PublishedLabel({
          neg: 1,
          val: bangerLabelFromScore(row.publishedScore!),
          uri: row.uri,
          score: row.publishedScore!,
          cid: row.cid,
          src: row.src,
          cts: row.cts,
          exp: row.exp,
        }),
      ];

    return [];
  }

  static fromCreateLabelData(createLabelData: CreateLabelData, score: number) {
    return {
      neg: createLabelData.neg ? 1 : 0,
      ...createLabelData,
      score,
    };
  }

  toCreateLabelData(): CreateLabelData {
    return {
      val: this.val,
      uri: this.uri,
      cid: this.cid,
      neg: this.neg === 1,
      src: this.src,
      cts: this.cts,
      exp: this.exp,
    };
  }
}
