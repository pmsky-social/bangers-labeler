/// starts a labeler server, a jetstream consumer, and keeps track of proposals, votes, and published labels

import { LabelerServer } from "@skyware/labeler";
import { Environment } from "./env";
import Pino, { Logger } from "pino";
import { type Database, createDb, migrateToLatest } from "./db/migrations";
import { VotesRepository } from "./db/repos/votesRepository";
import { ProposalsRepository } from "./db/repos/proposalsRepository";
import { Ingester } from "./ingester";
import { BangersRepository } from "./db/repos/bangersRepository";
import { Subscriber } from "./subscriber";
import { PublishedLabel } from "./db/types/publishedLabel";

export class Labeler {
  private subscriber: Subscriber;
  private server: LabelerServer;
  private ingester: Ingester;
  private votes: VotesRepository;
  private proposals: ProposalsRepository;
  private bangers: BangersRepository;

  constructor(
    private env: Environment,
    private db: Database,
    private logger: Logger
  ) {
    this.db = db;
    this.server = this.startServer();
    this.votes = new VotesRepository(db, env);
    this.proposals = new ProposalsRepository(db, env);
    this.bangers = new BangersRepository(db, env);
    this.subscriber = new Subscriber(this.checkForBangers.bind(this));
    this.ingester = new Ingester(env, db, this.subscriber);
    this.logger.info("Labeler initialized");
  }

  static async create(env: Environment) {
    const logger = Pino({ level: env.logLevel });
    const db = createDb(env.db_location);
    await migrateToLatest(db);
    return new Labeler(env, db, logger);
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
    const labels = await this.bangers.getBangersToPublish();
    for (const label of labels) await this.publishLabel(label);
  }

  async publishLabel(label: PublishedLabel) {
    this.logger.trace(label, "Publishing label");
    await this.bangers.publishLabel(label);
    await this.server.createLabel(label.toCreateLabelData());
  }
}

export function bangerLabelFromScore(score: string | number | bigint) {
  return `Banger lvl${score}`;
}
