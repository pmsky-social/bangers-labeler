import { Database } from "../migrations";
import { ProposalType } from "../types/proposal";
import { PublishedLabel } from "../types/publishedLabel";

export class BangersRepository {
  constructor(private db: Database) {}

  async getBangersToPublish(): Promise<PublishedLabel[]> {
    return await this.db
      .selectFrom("proposals")
      .where("proposals.typ", "=", ProposalType.POST_LABEL)
      .where("proposals.val", "=", "banger")
      .leftJoin("votes", "proposals.uri", "votes.subject")
      .leftJoin("publishedLabels", "proposals.uri", "publishedLabels.uri")
      .groupBy("proposals.uri")
      .select((eb) => [
        eb.ref("proposals.subject").as("uri"),
        eb.fn.sum(eb.ref("votes.val")).as("score"),
        eb
          .cast<boolean>(
            eb("publishedLabels.score", "=", eb.ref("score")),
            "boolean"
          )
          .as("shouldBePublished"),
      ])
      .execute()
      .then((rows) => rows.map(PublishedLabel.fromDbRow));
  }

  async publishLabel(req: PublishedLabel) {
    await this.db
      .insertInto("publishedLabels")
      .values(req)
      .onConflict((oc) => oc.columns(["val", "uri"]).doUpdateSet(req))
      .execute();
  }
}
