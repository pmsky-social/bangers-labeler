import { CommitCreate, CommitUpdate } from "@skyware/jetstream";
import * as VoteLexicon from "../../lexicon/types/social/pmsky/vote";
import { BadRecordError, BadRecordErrorKind } from "../../errors";
import { SOCIAL_PMSKY_VOTE } from "../../constants";
import { Record } from "../../lexicon/types/social/pmsky/vote";

export class Vote {
  public rkey!: string;
  public uri!: string; // at://${src}/social.pmsky.vote/${rkey}
  public cid!: string;
  public createdAt!: string;
  public ingestedAt!: string;
  public sig!: Uint8Array;
  public src!: string;
  public subject!: string; // subject
  public val!: number; // 1 | -1

  static tryFromRecord(
    commit:
      | CommitCreate<"social.pmsky.vote">
      | CommitUpdate<"social.pmsky.vote">
  ) {
    if (!VoteLexicon.isRecord(commit.record)) {
      throw new BadRecordError(
        BadRecordErrorKind.NOT_A_RECORD,
        SOCIAL_PMSKY_VOTE
      );
    }
    const validationResults = VoteLexicon.validateRecord(commit.record);
    if (!validationResults.success) {
      throw new BadRecordError(
        BadRecordErrorKind.INVALID,
        SOCIAL_PMSKY_VOTE,
        validationResults.error.message
      );
    }
    return Vote.fromRecord(commit);
  }

  static fromRecord(
    commit:
      | CommitCreate<"social.pmsky.vote">
      | CommitUpdate<"social.pmsky.vote">
  ) {
    const record: Record = commit.record as Record;
    return {
      rkey: commit.rkey,
      uri: `at://${record.src}/social.pmsky.vote/${commit.rkey}`,
      cid: record.cid,
      createdAt: record.cts,
      ingestedAt: new Date().toISOString(),
      sig: record.sig,
      src: record.src,
      subject: record.uri,
      val: record.val,
    } as Vote;
  }
}
