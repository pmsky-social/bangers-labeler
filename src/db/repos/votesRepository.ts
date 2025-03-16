import Pino from "pino";
import { Database } from "../migrations";
import { Vote } from "../types/vote";
import { Environment } from "../../env";

export class VotesRepository {
  private logger = Pino({ level: this.env.logLevel });
  constructor(
    private db: Database,
    private env: Environment
  ) {}

  async save(vote: Vote) {
    this.logger.trace(vote, "Saving vote");
    await this.db
      .insertInto("votes")
      .values({
        rkey: vote.rkey,
        uri: vote.uri,
        cid: vote.cid,
        createdAt: vote.createdAt,
        ingestedAt: vote.ingestedAt,
        sig: vote.sig,
        src: vote.src,
        subject: vote.subject,
        val: vote.val,
      })
      .onConflict((oc) => oc.columns(["src", "rkey"]).doNothing())
      .execute()
      .catch((ex) => {
        this.logger.error(ex, "error saving vote");
        throw ex;
      });
  }

  async delete(rkey: string) {
    await this.db.deleteFrom("votes").where("rkey", "=", rkey).execute();
  }
}
