/// starts a labeler server, a jetstream consumer, and keeps track of proposals, votes, and published labels

import { Jetstream } from "@skyware/jetstream";
import { LabelerServer } from "@skyware/labeler";
import { Environment } from "./env";
import * as Pino from "pino";
import { type Database, createDb } from "./db/migrations";

export class Labeler {
  private env: Environment;
  private logger: Pino.Logger;
  private db: Database;
  private server: LabelerServer;
  private jetstream: Jetstream;

  constructor() {
    this.env = Environment.load();
    this.logger = require("pino")();
    this.db = createDb(this.env.db_location);
    this.server = this.startServer();
    this.jetstream = this.startJetstream();
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

  startJetstream() {
    const jetstream = new Jetstream({
      wantedCollections: ["social.pmsky.proposal", "social.pmsky.vote"],
      wantedDids: [this.env.platform_did],
      endpoint: "wss://jetstream1.us-east.bsky.network/subscribe",
    });

    jetstream.on("error", (error) => {
      this.logger.error("Jetstream error:", error);
    });

    // todo: on commits, save to db & trigger a check

    jetstream.start();

    return jetstream;
  }

  /// checks the DB votes against published labels to see if any need to be updated
  checkForBangers() {}
}
