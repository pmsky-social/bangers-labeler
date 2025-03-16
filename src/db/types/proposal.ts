import Pino from "pino";
import { CommitCreate, CommitUpdate } from "@skyware/jetstream";

import * as ProposalLexicon from "../../lexicon/types/social/pmsky/proposal";
import { BadRecordError, BadRecordErrorKind } from "../../errors";
import { SOCIAL_PMSKY_PROPOSAL } from "../../constants";
import { Record } from "../../lexicon/types/social/pmsky/proposal";

export enum ProposalType {
  POST_LABEL = "post_label",
  ALLOWED_USER = "allowed_user",
}

export const ALL_PROPOSAL_TYPES = [
  ProposalType.POST_LABEL,
  ProposalType.ALLOWED_USER,
];

export class Proposal {
  public rkey!: string;
  public uri!: string; // at://${src}/social.pmsky.proposal/${rkey}
  public cid?: string; // record CID
  public createdAt!: string; // creation time
  public ingestedAt!: string; // ingested at
  public exp?: Date;
  public neg?: number;
  public sig?: string;
  public src!: string; // DID of the actor who created this proposal, probably pmsky.social
  public typ!: ProposalType;
  public subject!: string; // subject of proposal
  public val!: string; // value of proposal
  public ver?: number;

  static tryFromRecord(
    commit:
      | CommitCreate<"social.pmsky.proposal">
      | CommitUpdate<"social.pmsky.proposal">
  ) {
    if (!ProposalLexicon.isRecord(commit.record)) {
      throw new BadRecordError(
        BadRecordErrorKind.NOT_A_RECORD,
        SOCIAL_PMSKY_PROPOSAL
      );
    }
    const validationResults = ProposalLexicon.validateRecord(commit.record);
    if (!validationResults.success) {
      throw new BadRecordError(
        BadRecordErrorKind.INVALID,
        SOCIAL_PMSKY_PROPOSAL,
        validationResults.error.message
      );
    }
    const logger = Pino({ level: "trace" });
    logger.trace(commit, "casting record to Proposal");
    return this.fromRecord(commit);
  }

  static fromRecord(
    commit:
      | CommitCreate<"social.pmsky.proposal">
      | CommitUpdate<"social.pmsky.proposal">
  ) {
    const record = commit.record as Record;
    return {
      rkey: commit.rkey,
      uri: `at://${record.src}/social.pmsky.proposal/${commit.rkey}`,
      cid: record.cid,
      createdAt: record.cts,
      ingestedAt: new Date().toISOString(),
      exp: record.exp,
      neg: record.neg ? 1 : 0,
      sig: record.sig?.toString(),
      src: record.src,
      typ: record.typ,
      subject: record.uri,
      val: record.val,
      ver: record.ver,
    } as Proposal;
  }
}
