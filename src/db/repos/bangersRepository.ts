import Pino from "pino";
import { Environment } from "../../env";
import { Database } from "../migrations";
import { ProposalType } from "../types/proposal";
import { PublishedLabel } from "../types/publishedLabel";

export class BangersRepository {
  private logger = Pino({ level: this.env.logLevel });
  constructor(
    private db: Database,
    private env: Environment
  ) {}

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
        eb.fn.coalesce(eb.fn.sum(eb.ref("votes.val")), eb.val(0)).as("score"),
        eb
          .cast<boolean>(
            eb("publishedLabels.score", "=", eb.ref("score")),
            "integer"
          )
          .as("shouldBePublished"),
      ])
      .execute()
      .then((rows) => rows.map(PublishedLabel.fromDbRow))
      .catch((ex) => {
        this.logger.error(ex, "error getting bangers to publish");
        throw ex;
      });
  }

  async publishLabel(req: PublishedLabel) {
    return await this.db
      .insertInto("publishedLabels")
      .values(req)
      .onConflict((oc) => oc.columns(["val", "uri"]).doUpdateSet(req))
      .execute()
      .catch((err) => {
        this.logger.error(err, "error publishing label");
        throw err;
      });
  }
}
