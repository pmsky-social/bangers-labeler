import { CreateLabelData } from "@skyware/labeler";
import { Proposal } from "./types/proposal";
import { Vote } from "./types/vote";

export type DatabaseSchema = {
  proposals: Proposal;
  votes: Vote;
  publishedLabels: CreateLabelData;
};
