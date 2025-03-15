import { Proposal } from "./types/proposal";
import { Vote } from "./types/vote";
import { PublishedLabel } from "./types/publishedLabel";

export type DatabaseSchema = {
  proposals: Proposal;
  votes: Vote;
  publishedLabels: PublishedLabel;
};
