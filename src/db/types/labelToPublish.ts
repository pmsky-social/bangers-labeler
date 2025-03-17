import { PublishedLabel } from "./publishedLabel";

export class LabelToPublish {
  val: string;
  uri: string;
  score: number;
  publishedScore: number | null;
  cid?: string | undefined;
  src?: string | undefined;
  cts?: string | undefined;
  exp?: string | undefined;

  constructor(
    val: string,
    uri: string,
    score: number,
    publishedScore: number | null
  ) {
    this.val = val;
    this.uri = uri;
    this.score = score;
    this.publishedScore = publishedScore;
  }

  static fromDbRow(row: {
    val: string;
    uri: string;
    score: number;
    publishedScore: number | null;
  }) {
    return new LabelToPublish(
      row.val,
      row.uri,
      row.score,
      row.publishedScore ?? null
    );
  }

  toPublishedLabel(): PublishedLabel {
    return new PublishedLabel({
      val: this.val,
      uri: this.uri,
      score: this.score,
      cid: this.cid,
      neg: 0,
      src: this.src,
      cts: this.cts,
      exp: this.exp,
    });
  }
}
