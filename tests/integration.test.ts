let proposalOnCreateCallback: Function | undefined;
let voteOnCreateCallback: Function | undefined;

jest.mock("@skyware/jetstream", () => {
  return {
    Jetstream: jest.fn().mockImplementation((config) => {
      return {
        onCreate: jest.fn((type, cb) => {
          if (type === "social.pmsky.proposal") {
            proposalOnCreateCallback = cb;
          } else if (type === "social.pmsky.vote") {
            voteOnCreateCallback = cb;
          }
        }),
        on: jest.fn(),
        onUpdate: jest.fn(),
        onDelete: jest.fn(),
        start: jest.fn(),
      };
    }),
  };
});

jest.mock("@skyware/labeler", () => {
  return {
    LabelerServer: jest.fn().mockImplementation((config) => {
      return {
        start: jest.fn((port, callback) => callback(null)),
        createLabel: jest.fn(),
      };
    }),
  };
});

import { Labeler } from "../src/labeler";
import { migrateToLatest } from "../src/db/migrations";
import { Environment } from "../src/env";

describe("Integration Test: Proposal and Votes", () => {
  let labeler: Labeler;
  let mockServer: any;
  let env = new Environment();

  beforeAll(() => {
    env.labeler_did = "did:example:123";
    env.signingKey = "dummykey";
    env.port = 3000;
    env.db_location = ":memory:";
  });

  beforeEach(async () => {
    labeler = new Labeler(env);
    // Run migrations on the in-memory database
    await migrateToLatest((labeler as any).db);
    mockServer = (labeler as any)["server"];
    if (mockServer.createLabel && mockServer.createLabel.mockClear) {
      mockServer.createLabel.mockClear();
    }
  });

  it("should simulate a proposal and three vote events and check createLabel calls", async () => {
    // Create a valid proposal event that qualifies for a banger label
    const proposalUri =
      "at://did:example:source/social.pmsky.proposal/proposal1";
    const proposalEvent = {
      commit: {
        rkey: "proposal1",
        record: {
          $type: "social.pmsky.proposal",
          rkey: "proposal1",
          uri: "at://post1",
          cid: "bafybeigdyrztif5e3bp4s2rqv5vxxsxzycytxrjy65m6p45w6xwe6v4hpi",
          cts: new Date().toISOString(),
          exp: new Date(Date.now() + 60000).toISOString(),
          neg: false,
          sig: new Uint8Array([0]),
          src: "did:example:source",
          typ: "post_label",
          val: "banger",
          ver: 1,
        },
      },
    };

    // Trigger the proposal event via the onCreate callback
    if (proposalOnCreateCallback) {
      await proposalOnCreateCallback(proposalEvent);
    }

    // Prepare three vote events: two upvotes and one downvote
    const voteEvents = [
      {
        commit: {
          rkey: "vote1",
          record: {
            $type: "social.pmsky.vote",
            rkey: "vote1",
            uri: proposalUri,
            cid: "bafybeif72ytsvlscfgv3spg6pmqu6y5sodxvdwyumjt6hpuxr2hnh3f7oq",
            cts: new Date().toISOString(),
            sig: new Uint8Array(),
            src: "did:example:voter",
            val: 1,
          },
        },
      },
      {
        commit: {
          rkey: "vote2",
          record: {
            $type: "social.pmsky.vote",
            rkey: "vote2",
            cid: "bafybeib2bzwt2okiy6bqz2dfgybdw3x6gld72hyoe4p2wgy7l3c46p5kfa",
            cts: new Date().toISOString(),
            sig: new Uint8Array(),
            src: "did:example:voter",
            uri: proposalUri,
            val: 1,
          },
        },
      },
      {
        commit: {
          rkey: "vote3",
          record: {
            $type: "social.pmsky.vote",
            rkey: "vote3",
            cid: "bafybeiaw4qj3zyacbpfsan3nox2g6xjyvntw32b2vjqf7cylu47s6snh7a",
            cts: new Date().toISOString(),
            sig: new Uint8Array(),
            src: "did:example:voter",
            uri: proposalUri,
            val: -1,
          },
        },
      },
    ];

    // Process each vote event, triggering its callback and a subsequent commit
    for (const voteEvent of voteEvents) {
      if (voteOnCreateCallback) {
        await voteOnCreateCallback(voteEvent);
      }
    }

    // TODO: only thing left might be a timing issue, are we awaiting everything correctly?

    // We expect createLabel to be called once per vote event (3 times total)
    expect(mockServer.createLabel).toHaveBeenCalledTimes(3);
    const calls = mockServer.createLabel.mock.calls;

    // Expected cumulative scores:
    // After first vote: score = 1 -> label should be 'Banger lvl1'
    // After second vote: score = 2 -> label should be 'Banger lvl2'
    // After third vote: score = 1 -> label should be 'Banger lvl1'
    expect(calls[0][0].val).toBe("Banger lvl1");
    expect(calls[1][0].val).toBe("Banger lvl2");
    expect(calls[2][0].val).toBe("Banger lvl1");
  });
});
