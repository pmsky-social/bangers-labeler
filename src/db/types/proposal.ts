import { ResolveLexicon } from "@skyware/jetstream";

import * as ProposalLexicon from "../../lexicon/types/social/pmsky/proposal";
import { BadRecordError, BadRecordErrorKind } from "../../errors";
import { SOCIAL_PMSKY_PROPOSAL } from "../../constants";

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
  public cid!: string; // record CID
  public createdAt!: Date; // creation time
  public ingestedAt!: Date; // ingested at
  public exp!: Date;
  public neg!: boolean;
  public sig!: Uint8Array;
  public src!: string; // DID of the actor who created this proposal, probably pmsky.social
  public typ!: ProposalType;
  public subject!: string; // subject of proposal
  public val!: string; // value of proposal
  public ver!: number;

  static tryFromRecord(record: ResolveLexicon<"social.pmsky.proposal">) {
    if (!ProposalLexicon.isRecord(record)) {
      throw new BadRecordError(
        BadRecordErrorKind.NOT_A_RECORD,
        SOCIAL_PMSKY_PROPOSAL
      );
    }
    const validationResults = ProposalLexicon.validateRecord(record);
    if (!validationResults.success) {
      throw new BadRecordError(
        BadRecordErrorKind.INVALID,
        SOCIAL_PMSKY_PROPOSAL,
        validationResults
      );
    }
    return record as unknown as Proposal;
  }
}
