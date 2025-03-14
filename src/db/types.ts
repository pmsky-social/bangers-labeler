import { Proposal } from "./types/proposal";
import { Vote } from "./types/vote";

export type DatabaseSchema = {
  proposals: Proposal;
  votes: Vote;
  publishedLabels: PublishedLabel;
};

export enum LabelValue {
  BANGER_5,
}

export type PublishedLabel = {
  uri: string;
  timePublished: Date;
  label: LabelValue;
};
