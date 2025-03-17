import Pino from "pino";
import { Environment } from "../../env";
import { Database } from "../migrations";
import { ProposalType } from "../types/proposal";
import { PublishedLabel } from "../types/publishedLabel";
import { LabelToPublish } from "../types/labelToPublish";
import { bangerLabelFromScore } from "../../labeler";
import { BadScoreError } from "../../errors";

export class BangersRepository {
  private logger = Pino({ level: this.env.logLevel });
  constructor(
    private db: Database,
    private env: Environment
  ) {}

  async getBangersToPublish(): Promise<LabelToPublish[]> {
    return await this.db
      .selectFrom("proposals")
      .where("proposals.typ", "=", ProposalType.POST_LABEL)
      .where("proposals.val", "=", "banger")
      .leftJoin("votes", "proposals.uri", "votes.subject")
      .leftJoin("publishedLabels", "proposals.subject", "publishedLabels.uri")
      .where((eb) =>
        eb.or([
          eb("publishedLabels.neg", "is", null),
          eb("publishedLabels.neg", "!=", 1),
        ])
      )
      .groupBy("proposals.uri")
      .select((eb) => [
        eb.ref("proposals.subject").as("uri"),
        eb.fn.coalesce(eb.fn.sum(eb.ref("votes.val")), eb.val(0)).as("score"),
        eb.ref("publishedLabels.score").as("publishedScore"),
      ])
      // .having((eb) => eb(eb.ref("score"), "!=", eb.ref("publishedScore")))
      .execute()
      .then((rows) =>
        rows.map((row) => {
          const score = Number(row.score);
          const publishedScore = row.publishedScore
            ? Number(row.publishedScore)
            : null;
          if (isNaN(score)) throw new BadScoreError(row.uri, row.score);
          if (publishedScore !== null && isNaN(publishedScore))
            throw new BadScoreError(row.uri, row.publishedScore);
          return LabelToPublish.fromDbRow({
            val: bangerLabelFromScore(row.score),
            uri: row.uri,
            score,
            publishedScore,
          });
        })
      )
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
      })
      .then(() => {
        this.logger.trace(req, "saved published label");
      });
  }
}
