import {
  CommitCreateEvent,
  CommitUpdateEvent,
  Jetstream,
} from "@skyware/jetstream";
import Pino, { Logger } from "pino";
import { SOCIAL_PMSKY_PROPOSAL, SOCIAL_PMSKY_VOTE } from "./constants";
import { Environment } from "./env";
import { Proposal } from "./db/types/proposal";
import { Database } from "./db/migrations";
import { ProposalsRepository } from "./db/repos/proposalsRepository";
import { VotesRepository } from "./db/repos/votesRepository";
import { Vote } from "./db/types/vote";
import { Subscriber } from "./subscriber";

export class Ingester {
  private logger: Logger;
  private jetstream: Jetstream;
  private proposals: ProposalsRepository;
  private votes: VotesRepository;

  constructor(
    private env: Environment,
    private db: Database,
    private subscriber: Subscriber
  ) {
    this.logger = Pino();
    this.jetstream = this.startJetstream();
    this.proposals = new ProposalsRepository(this.db);
    this.votes = new VotesRepository(this.db);
  }

  startJetstream() {
    const jetstream = new Jetstream({
      wantedCollections: [SOCIAL_PMSKY_PROPOSAL, SOCIAL_PMSKY_VOTE],
      wantedDids: [this.env.platform_did],
      endpoint: "wss://jetstream1.us-east.bsky.network/subscribe",
    });

    jetstream.on("error", (error) => {
      this.logger.error("Jetstream error:", error);
    });

    jetstream.on("commit", (commit) => {
      this.logger.info("Jetstream commit:", commit);
      this.subscriber.trigger();
    });

    jetstream.onCreate(SOCIAL_PMSKY_PROPOSAL, this.newProposal.bind(this));
    jetstream.onUpdate(SOCIAL_PMSKY_PROPOSAL, this.newProposal.bind(this));
    jetstream.onCreate(SOCIAL_PMSKY_VOTE, this.newVote.bind(this));
    jetstream.onUpdate(SOCIAL_PMSKY_VOTE, this.newVote.bind(this));

    jetstream.onDelete(SOCIAL_PMSKY_PROPOSAL, async (evt) => {
      this.logger.trace(evt, "deleting label");
      this.proposals.delete(evt.commit.rkey.toString());
    });
    jetstream.onDelete(SOCIAL_PMSKY_VOTE, async (evt) => {
      this.logger.trace(evt, "deleting vote");
      this.votes.delete(evt.commit.rkey.toString());
    });

    jetstream.start();

    return jetstream;
  }

  async newProposal(
    evt:
      | CommitCreateEvent<"social.pmsky.proposal">
      | CommitUpdateEvent<"social.pmsky.proposal">
  ) {
    this.logger.trace(evt, "new proposal");
    try {
      const proposal = Proposal.tryFromRecord(evt.commit.record);
      this.proposals.save(proposal);
    } catch (ex) {
      this.logger.error(evt, "invalid proposal record from jetstream", ex);
    }
  }

  async newVote(
    evt:
      | CommitCreateEvent<"social.pmsky.vote">
      | CommitUpdateEvent<"social.pmsky.vote">
  ) {
    this.logger.trace(evt, "new vote");
    try {
      const vote = Vote.tryFromRecord(evt.commit.record);
      this.votes.save(vote);
    } catch (ex) {
      this.logger.error(evt, "invalid vote record from jetstream", ex);
    }
  }
}
