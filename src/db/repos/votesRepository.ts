import { Database } from "../migrations";
import { Vote } from "../types/vote";

export class VotesRepository {
  constructor(private db: Database) {}

  async save(vote: Vote) {
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
      .execute();
  }

  async delete(rkey: string) {
    await this.db.deleteFrom("votes").where("rkey", "=", rkey).execute();
  }
}
