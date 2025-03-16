import { type Proposal } from "../types/proposal";
import Pino from "pino";
import { Database } from "../migrations";
import { Environment } from "../../env";

export class ProposalsRepository {
  private logger = Pino({ level: this.env.logLevel });
  constructor(
    private db: Database,
    private env: Environment
  ) {}

  async getProposals() {
    return (await this.db.selectFrom("proposals").selectAll().execute()).map(
      (row) => row as Proposal
    );
  }

  async save(proposal: Proposal) {
    const insertVal = {
      rkey: proposal.rkey,
      uri: proposal.uri,
      cid: proposal.cid,
      createdAt: proposal.createdAt,
      ingestedAt: proposal.ingestedAt,
      exp: proposal.exp,
      neg: proposal.neg,
      sig: proposal.sig,
      src: proposal.src,
      typ: proposal.typ,
      subject: proposal.subject,
      val: proposal.val,
      ver: proposal.ver,
    };
    this.logger.trace(insertVal, "Saving proposal");
    await this.db
      .insertInto("proposals")
      .values(insertVal)
      .onConflict((oc) => oc.columns(["src", "rkey"]).doNothing())
      .execute()
      .catch((ex) => {
        this.logger.error(ex, "error saving proposal");
        throw ex;
      });
  }

  async delete(rkey: string) {
    await this.db.deleteFrom("proposals").where("rkey", "=", rkey).execute();
  }
}
