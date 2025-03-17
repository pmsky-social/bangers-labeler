export class BadRecordError extends Error {
  constructor(
    public kind: BadRecordErrorKind,
    public lexicon: string,
    public validationResultErrorMsg?: string
  ) {
    const message = kind.valueOf();
    super(message);
  }
}

export enum BadRecordErrorKind {
  NOT_A_RECORD = "not a record",
  INVALID = "did not pass validation",
}

export class BadScoreError extends Error {
  constructor(
    public uri: string,
    public score: any
  ) {
    super(`Score was NaN for ${uri}: ${score}`);
  }
}
