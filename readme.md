# PMsky Bangers

A simple labeler to serve as an example for how to consume 
`social.pmsky.proposal`s and `social.pmsky.vote`s from the firehose and 
publish labels based on them.

## Pieces
- A jetstream consumer, which filters on `social.pmsky.*` records
- A database which stores proposals and votes as they come in
- The endpoints that make up a labeler to publish labels based on those proposals and votes.

## How it works

On startup, we begin listening to the jetstream, via the [ingester](./src/ingester.ts).
It listens for `social.pmsky.proposal` and `social.pmsky.vote` record types, and 
stores those records in a local sqlite db generally as-is.

On each jetstream event/commit, we trigger a function via the [subscriber](./src/subscriber.ts) class.
This is setup to call the [`checkForBangers`](./src/labeler.ts) function.

When we `checkForBangers`, we pull from the database all of the existing proposals and their scores, along with currently published labels.  We then publish each label, which both publishes the label to atproto and onto bluesky, but also saves the label to our `PublishedLabels` table with the score that was published, allowing us to retract and update labels as a proposal's score changes.

In summary:
1. New vote appears via jetstream
2. Votes and proposals saved to local sqlite db
3. DB is queried to retrieve the set of labels that should be published and retracted
4. Labels are published, updating both the atproto network and our local db with the current state of published labels.