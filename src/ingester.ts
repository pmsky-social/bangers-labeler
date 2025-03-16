import {
  CommitCreateEvent,
  CommitUpdateEvent,
  Jetstream,
} from "@skyware/jetstream";
import ws from "ws";
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
    this.logger = Pino({ level: env.logLevel });
    this.proposals = new ProposalsRepository(this.db, this.env);
    this.votes = new VotesRepository(this.db, this.env);
    this.jetstream = this.startJetstream();
  }

  startJetstream() {
    this.logger.info("Starting Jetstream");
    const jetstream = new Jetstream({
      wantedCollections: [SOCIAL_PMSKY_PROPOSAL, SOCIAL_PMSKY_VOTE],
      wantedDids: [this.env.platform_did],
      endpoint: "wss://jetstream1.us-east.bsky.network/subscribe",
      ws,
    });

    jetstream.on("error", (error) => {
      this.logger.error("Jetstream error:", error);
    });

    jetstream.onCreate(
      SOCIAL_PMSKY_PROPOSAL,
      async (evt) => await this.newProposal(evt)
    );
    jetstream.onUpdate(SOCIAL_PMSKY_PROPOSAL, this.newProposal.bind(this));
    jetstream.onCreate(
      SOCIAL_PMSKY_VOTE,
      async (evt) => await this.newVote(evt)
    );
    jetstream.onUpdate(SOCIAL_PMSKY_VOTE, this.newVote.bind(this));

    jetstream.onDelete(SOCIAL_PMSKY_PROPOSAL, async (evt) => {
      this.logger.trace(evt, "deleting label");
      await this.proposals.delete(evt.commit.rkey.toString());
    });
    jetstream.onDelete(SOCIAL_PMSKY_VOTE, async (evt) => {
      this.logger.trace(evt, "deleting vote");
      await this.votes.delete(evt.commit.rkey.toString());
    });

    jetstream.start();

    this.logger.trace("Jetstream started");

    return jetstream;
  }

  async newProposal(
    evt:
      | CommitCreateEvent<"social.pmsky.proposal">
      | CommitUpdateEvent<"social.pmsky.proposal">
  ) {
    this.logger.trace(evt, "new proposal");
    try {
      const proposal = Proposal.tryFromRecord(evt.commit);
      await this.proposals.save(proposal);
    } catch (ex) {
      this.logger.error({ evt, ex }, "invalid proposal record from jetstream");
    }
  }

  async newVote(
    evt:
      | CommitCreateEvent<"social.pmsky.vote">
      | CommitUpdateEvent<"social.pmsky.vote">
  ) {
    this.logger.trace(evt, "new vote");
    try {
      const vote = Vote.tryFromRecord(evt.commit);
      await this.votes.save(vote);
      await this.subscriber.trigger();
    } catch (ex) {
      this.logger.error({ evt, ex }, "invalid vote record from jetstream");
    }
  }
}
