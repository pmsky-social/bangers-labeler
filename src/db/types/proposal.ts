export enum ProposalType {
  POST_LABEL = "post_label",
  ALLOWED_USER = "allowed_user",
}

export const ALL_PROPOSAL_TYPES = [
  ProposalType.POST_LABEL,
  ProposalType.ALLOWED_USER,
];

export type Proposal = {
  rkey: string;
  uri: string; // at://${src}/social.pmsky.proposal/${rkey}
  cid: string; // record CID
  createdAt: Date; // creation time
  ingestedAt: Date; // ingested at
  exp: Date;
  neg: boolean;
  sig: Uint8Array;
  src: string; // DID of the actor who created this proposal, probably pmsky.social
  typ: ProposalType;
  subject: string; // subject of proposal
  val: string; // value of proposal
  ver: number;
};
