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
  ComAtprotoLabelDefs: {
    lexicon: 1,
    id: 'com.atproto.label.defs',
    defs: {
      label: {
        type: 'object',
        required: ['src', 'uri', 'val', 'cts'],
        properties: {
          cid: {
            type: 'string',
            format: 'cid',
            description:
              "Optionally, CID specifying the specific version of 'uri' resource this label applies to.",
          },
          cts: {
            type: 'string',
            format: 'datetime',
            description: 'Timestamp when this label was created.',
          },
          exp: {
            type: 'string',
            format: 'datetime',
            description:
              'Timestamp at which this label expires (no longer applies).',
          },
          neg: {
            type: 'boolean',
            description:
              'If true, this is a negation label, overwriting a previous label.',
          },
          sig: {
            type: 'bytes',
            description: 'Signature of dag-cbor encoded label.',
          },
          src: {
            type: 'string',
            format: 'did',
            description: 'DID of the actor who created this label.',
          },
          uri: {
            type: 'string',
            format: 'uri',
            description:
              'AT URI of the record, repository (account), or other resource that this label applies to.',
          },
          val: {
            type: 'string',
            maxLength: 128,
            description:
              'The short string name of the value or type of this label.',
          },
          ver: {
            type: 'integer',
            description: 'The AT Protocol version of the label object.',
          },
        },
        description:
          'Metadata tag on an atproto resource (eg, repo or record).',
      },
      selfLabel: {
        type: 'object',
        required: ['val'],
        properties: {
          val: {
            type: 'string',
            maxLength: 128,
            description:
              'The short string name of the value or type of this label.',
          },
        },
        description:
          'Metadata tag on an atproto record, published by the author within the record. Note that schemas should use #selfLabels, not #selfLabel.',
      },
      labelValue: {
        type: 'string',
        knownValues: [
          '!hide',
          '!no-promote',
          '!warn',
          '!no-unauthenticated',
          'dmca-violation',
          'doxxing',
          'porn',
          'sexual',
          'nudity',
          'nsfl',
          'gore',
        ],
      },
      selfLabels: {
        type: 'object',
        required: ['values'],
        properties: {
          values: {
            type: 'array',
            items: {
              ref: 'lex:com.atproto.label.defs#selfLabel',
              type: 'ref',
            },
            maxLength: 10,
          },
        },
        description:
          'Metadata tags on an atproto record, published by the author within the record.',
      },
      labelValueDefinition: {
        type: 'object',
        required: ['identifier', 'severity', 'blurs', 'locales'],
        properties: {
          blurs: {
            type: 'string',
            description:
              "What should this label hide in the UI, if applied? 'content' hides all of the target; 'media' hides the images/video/audio; 'none' hides nothing.",
            knownValues: ['content', 'media', 'none'],
          },
          locales: {
            type: 'array',
            items: {
              ref: 'lex:com.atproto.label.defs#labelValueDefinitionStrings',
              type: 'ref',
            },
          },
          severity: {
            type: 'string',
            description:
              "How should a client visually convey this label? 'inform' means neutral and informational; 'alert' means negative and warning; 'none' means show nothing.",
            knownValues: ['inform', 'alert', 'none'],
          },
          adultOnly: {
            type: 'boolean',
            description:
              'Does the user need to have adult content enabled in order to configure this label?',
          },
          identifier: {
            type: 'string',
            maxLength: 100,
            description:
              "The value of the label being defined. Must only include lowercase ascii and the '-' character ([a-z-]+).",
            maxGraphemes: 100,
          },
          defaultSetting: {
            type: 'string',
            default: 'warn',
            description: 'The default setting for this label.',
            knownValues: ['ignore', 'warn', 'hide'],
          },
        },
        description:
          'Declares a label value and its expected interpretations and behaviors.',
      },
      labelValueDefinitionStrings: {
        type: 'object',
        required: ['lang', 'name', 'description'],
        properties: {
          lang: {
            type: 'string',
            format: 'language',
            description:
              'The code of the language these strings are written in.',
          },
          name: {
            type: 'string',
            maxLength: 640,
            description: 'A short human-readable name for the label.',
            maxGraphemes: 64,
          },
          description: {
            type: 'string',
            maxLength: 100000,
            description:
              'A longer description of what the label means and why it might be applied.',
            maxGraphemes: 10000,
          },
        },
        description:
          'Strings which describe the label in the UI, localized into a specific language.',
      },
    },
  },
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
  ComAtprotoLabelDefs: 'com.atproto.label.defs',
  SocialPmskyProposal: 'social.pmsky.proposal',
  SocialPmskyVote: 'social.pmsky.vote',
} as const
