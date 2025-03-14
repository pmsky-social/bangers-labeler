export type Vote = {
  rkey: string;
  uri: string; // at://${src}/social.pmsky.vote/${rkey}
  cid: string;
  createdAt: Date;
  ingestedAt: Date;
  sig: Uint8Array;
  src: string;
  subject: string; // subject
  val: string; // 1 | -1
};
