/// starts a labeler server, a jetstream consumer, and keeps track of proposals, votes, and published labels

import { Jetstream } from "@skyware/jetstream";
import { CreateLabelData, LabelerServer } from "@skyware/labeler";
import { Environment } from "./env";
import * as Pino from "pino";
import { type Database, createDb } from "./db/migrations";
import { SOCIAL_PMSKY_PROPOSAL, SOCIAL_PMSKY_VOTE } from "./constants";
import { VotesRepository } from "./db/repos/votesRepository";
import { ProposalsRepository } from "./db/repos/proposalsRepository";
import * as ProposalLexicon from "./lexicon/types/social/pmsky/proposal";
import { Proposal } from "./db/types/proposal";
import { Ingester } from "./ingester";
import { BangersRepository } from "./db/repos/bangersRepository";
import { Subscriber } from "./subscriber";

export class Labeler {
  private env: Environment;
  private logger: Pino.Logger;
  private db: Database;
  private subscriber: Subscriber;
  private server: LabelerServer;
  private ingester: Ingester;
  private votes: VotesRepository;
  private proposals: ProposalsRepository;
  private bangers: BangersRepository;

  constructor() {
    this.env = Environment.load();
    this.logger = require("pino")();
    this.db = createDb(this.env.db_location);
    this.server = this.startServer();
    this.subscriber = new Subscriber(this.checkForBangers.bind(this));
    this.ingester = new Ingester(this.env, this.db, this.subscriber);
    this.votes = new VotesRepository(this.db);
    this.proposals = new ProposalsRepository(this.db);
    this.bangers = new BangersRepository(this.db);
  }

  startServer() {
    const server = new LabelerServer({
      did: this.env.labeler_did,
      signingKey: this.env.signingKey,
    });

    server.start(this.env.port, (error) => {
      if (error) {
        this.logger.error("Failed to start server:", error);
      } else {
        this.logger.info(`Labeler server running on port ${this.env.port}`);
      }
    });

    return server;
  }

  /// checks the DB votes against published labels to see if any need to be updated
  async checkForBangers() {
    this.logger.trace("Checking for labels to publish");
    const toPublish = await this.bangers.getBangersToPublish();
    this.logger.trace(toPublish, "Bangers to publish");
    for (const proposal of toPublish) {
      const req: CreateLabelData = {
        val: bangerLabelFromScore(proposal.score),
        uri: proposal.subject,
        neg: !proposal.shouldPublish,
        cts: new Date().toISOString(),
      };
      this.publishLabel(req);
    }
  }

  async publishLabel(proposal: ) {
    // todo: might want to store score in publishedLabel table
    this.logger.trace(proposal, "Publishing label");
    this.bangers.publishLabel(req);
    this.server.createLabel(req);
  }
}

export function bangerLabelFromScore(score: string | number | bigint) {
  return `Banger lvl${score}`;
}
