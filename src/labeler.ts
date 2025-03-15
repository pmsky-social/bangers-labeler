/// starts a labeler server, a jetstream consumer, and keeps track of proposals, votes, and published labels

import { LabelerServer } from "@skyware/labeler";
import { Environment } from "./env";
import * as Pino from "pino";
import { type Database, createDb } from "./db/migrations";
import { VotesRepository } from "./db/repos/votesRepository";
import { ProposalsRepository } from "./db/repos/proposalsRepository";
import { Ingester } from "./ingester";
import { BangersRepository } from "./db/repos/bangersRepository";
import { Subscriber } from "./subscriber";
import { PublishedLabel } from "./db/types/publishedLabel";

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
    await this.bangers
      .getBangersToPublish()
      .then((labels) => labels.map((label) => this.publishLabel(label)));
  }

  async publishLabel(label: PublishedLabel) {
    this.logger.trace(label, "Publishing label");
    this.bangers.publishLabel(label);
    this.server.createLabel(label.toCreateLabelData());
  }
}

export function bangerLabelFromScore(score: string | number | bigint) {
  return `Banger lvl${score}`;
}
