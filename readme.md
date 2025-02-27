# PMsky Bangers

A simple labeler to serve as an example for how to consume 
`social.pmsky.proposal`s and `social.pmsky.vote`s from the firehose and 
publish labels based on them.

## Pieces
- A jetstream consumer, which filters on `social.pmsky.*` records
- A database which stores proposals and votes as they come in
- The endpoints that make up a labeler to publish labels based on those proposals and votes.

