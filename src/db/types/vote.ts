import { ResolveLexicon } from "@skyware/jetstream";
import * as VoteLexicon from "../../lexicon/types/social/pmsky/vote";
import { BadRecordError, BadRecordErrorKind } from "../../errors";
import { SOCIAL_PMSKY_VOTE } from "../../constants";

export class Vote {
  public rkey!: string;
  public uri!: string; // at://${src}/social.pmsky.vote/${rkey}
  public cid!: string;
  public createdAt!: Date;
  public ingestedAt!: Date;
  public sig!: Uint8Array;
  public src!: string;
  public subject!: string; // subject
  public val!: string; // 1 | -1

  static tryFromRecord(record: ResolveLexicon<"social.pmsky.vote">) {
    if (!VoteLexicon.isRecord(record)) {
      throw new BadRecordError(
        BadRecordErrorKind.NOT_A_RECORD,
        SOCIAL_PMSKY_VOTE
      );
    }
    const validationResults = VoteLexicon.validateRecord(record);
    if (!validationResults.success) {
      throw new BadRecordError(
        BadRecordErrorKind.INVALID,
        SOCIAL_PMSKY_VOTE,
        validationResults
      );
    }
    return record as unknown as Vote;
  }
}
