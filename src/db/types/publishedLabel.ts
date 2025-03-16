import { CreateLabelData } from "@skyware/labeler";
import { bangerLabelFromScore } from "../../labeler";

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
      shouldBePublished: boolean;
    } & Partial<PublishedLabel>
  ): PublishedLabel {
    return new PublishedLabel({
      neg: row.shouldBePublished ? 0 : 1,
      val: bangerLabelFromScore(row.score),
      uri: row.uri,
      score: row.score,
      cid: row.cid,
      src: row.src,
      cts: row.cts,
      exp: row.exp,
    });
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
