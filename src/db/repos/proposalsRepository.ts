import { type Proposal } from "../types/proposal";
import { Database } from "../migrations";

export class ProposalsRepository {
  constructor(private db: Database) {}

  async getProposals() {
    return (await this.db.selectFrom("proposals").selectAll().execute()).map(
      (row) => row as Proposal
    );
  }

  async save(proposal: Proposal) {
    await this.db
      .insertInto("proposals")
      .values({
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
      })
      .execute();
  }

  async delete(rkey: string) {
    await this.db.deleteFrom("proposals").where("rkey", "=", rkey).execute();
  }
}
