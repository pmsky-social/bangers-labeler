import { CreateLabelData } from "@skyware/labeler";
import { Database } from "../migrations";
import { ProposalType } from "../types/proposal";
import { on } from "events";

export class BangersRepository {
  constructor(private db: Database) {}

  /// todo: update this to return shouldPublish: true/false, based on the previously published table
  async getBangersToPublish() {
    return await this.db
      .selectFrom("proposals")
      .where("proposals.typ", "=", ProposalType.POST_LABEL)
      .where("proposals.val", "=", "banger")
      .leftJoin("votes", "proposals.uri", "votes.subject")
      .leftJoin("publishedLabels", "proposals.uri", "publishedLabels.uri")
      .groupBy("proposals.uri")
      .select((eb) => [
        // todo: what else do we need to publish the label?
        eb.ref("proposals.uri").as("uri"),
        eb.ref("proposals.subject").as("subject"),
        eb.fn.sum(eb.ref("votes.val")).as("score"),
        // todo: should be a boolean showing if it should be published or retracted
        eb.exists(eb.ref("proposals.uri")).as("shouldPublish"),
      ])
      .execute();
  }

  async publishLabel(req: CreateLabelData) {
    await this.db
      .insertInto("publishedLabels")
      .values(req)
      .onConflict((oc) => oc.columns(["val", "uri"]).doUpdateSet(req))
      .execute();
  }
}
