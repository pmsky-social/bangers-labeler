/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  type LexiconDoc,
  Lexicons,
  ValidationError,
  type ValidationResult,
} from '@atproto/lexicon'
import { type $Typed, is$typed, maybe$typed } from './util.js'

export const schemaDict = {
  SocialPmskyProposal: {
    lexicon: 1,
    id: 'social.pmsky.proposal',
    defs: {
      main: {
        key: 'tid',
        type: 'record',
        record: {
          type: 'object',
          required: ['typ', 'src', 'uri', 'val', 'cts'],
          properties: {
            cid: {
              type: 'string',
              format: 'cid',
              description:
                "Optionally, CID specifying the specific version of 'uri' resource this proposal applies to.",
            },
            cts: {
              type: 'string',
              format: 'datetime',
              description: 'Timestamp when this proposal was created.',
            },
            exp: {
              type: 'string',
              format: 'datetime',
              description:
                'Timestamp at which this proposal expires (no longer applies).',
            },
            neg: {
              type: 'boolean',
              description:
                'If true, this is a negation of a proposal, overwriting a previous proposal.',
            },
            sig: {
              type: 'bytes',
              description: 'Signature of dag-cbor encoded proposal.',
            },
            src: {
              type: 'string',
              format: 'did',
              description: 'DID of the actor who created this proposal.',
            },
            typ: {
              type: 'string',
              description:
                "the type of proposal, currently expected values are 'allowed_user' or 'post_proposal'",
            },
            uri: {
              type: 'string',
              format: 'uri',
              description:
                'AT URI of the record, repository (account), or other resource that this proposal applies to.',
            },
            val: {
              type: 'string',
              maxLength: 128,
              description:
                'The short string name of the value or type of this proposal.',
            },
            ver: {
              type: 'integer',
              description: 'The AT Protocol version of the proposal object.',
            },
          },
          description:
            'Some proposal that refers to another ATproto record.  Similar to `com.atproto.proposal.defs#label, but as a concrete record type.',
        },
      },
    },
  },
  SocialPmskyVote: {
    lexicon: 1,
    id: 'social.pmsky.vote',
    defs: {
      main: {
        key: 'tid',
        type: 'record',
        record: {
          type: 'object',
          required: ['src', 'uri', 'val', 'cts'],
          properties: {
            cid: {
              type: 'string',
              format: 'cid',
              description:
                "Optionally, CID specifying the specific version of 'uri' resource this vote applies to.",
            },
            cts: {
              type: 'string',
              format: 'datetime',
              description: 'Timestamp when this vote was created.',
            },
            sig: {
              type: 'bytes',
              description: 'Signature of dag-cbor encoded vote.',
            },
            src: {
              type: 'string',
              format: 'did',
              description:
                'the account creating the vote, not necessarily the same as the user who voted',
            },
            uri: {
              type: 'string',
              format: 'uri',
              description:
                'AT URI of the record, repository (account), or other resource that this vote applies to.',
            },
            val: {
              type: 'integer',
              description: 'The value of the vote, either +1 or -1',
            },
          },
          description:
            "a vote record, representing a user's agreement or disagreement with the referenced record, be it a label, post, or user.",
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[]
export const lexicons: Lexicons = new Lexicons(schemas)

export function validate<T extends { $type: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType: true,
): ValidationResult<T>
export function validate<T extends { $type?: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: false,
): ValidationResult<T>
export function validate(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: boolean,
): ValidationResult {
  return (requiredType ? is$typed : maybe$typed)(v, id, hash)
    ? lexicons.validate(`${id}#${hash}`, v)
    : {
        success: false,
        error: new ValidationError(
          `Must be an object with "${hash === 'main' ? id : `${id}#${hash}`}" $type property`,
        ),
      }
}

export const ids = {
  SocialPmskyProposal: 'social.pmsky.proposal',
  SocialPmskyVote: 'social.pmsky.vote',
} as const
