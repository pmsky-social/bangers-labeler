/// starts a labeler server, a jetstream consumer, and keeps track of proposals, votes, and published labels

import { Jetstream } from "@skyware/jetstream";
import { LabelerServer } from "@skyware/labeler";
import { Environment } from "./env";
import * as Pino from "pino";
import { type Database, createDb } from "./db/migrations";
import { SOCIAL_PMSKY_PROPOSAL, SOCIAL_PMSKY_VOTE } from "./constants";
import { VotesRepository } from "./db/repos/votesRepository";
import { ProposalsRepository } from "./db/repos/proposalsRepository";
import * as ProposalLexicon from "./lexicon/types/social/pmsky/proposal";
import { Proposal } from "./db/types/proposal";
import { Ingester } from "./ingester";

export class Labeler {
  private env: Environment;
  private logger: Pino.Logger;
  private db: Database;
  private server: LabelerServer;
  private ingester: Ingester;
  private votes: VotesRepository;
  private proposals: ProposalsRepository;

  constructor() {
    this.env = Environment.load();
    this.logger = require("pino")();
    this.db = createDb(this.env.db_location);
    this.server = this.startServer();
    this.ingester = new Ingester(this.env, this.db);
    this.votes = new VotesRepository(this.db);
    this.proposals = new ProposalsRepository(this.db);
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
  checkForBangers() {}
}
