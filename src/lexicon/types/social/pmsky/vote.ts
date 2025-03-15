/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../lexicons'
import { type $Typed, is$typed as _is$typed, type OmitKey } from '../../../util'

const is$typed = _is$typed,
  validate = _validate
const id = 'social.pmsky.vote'

/** a vote record, representing a user's agreement or disagreement with the referenced record, be it a label, post, or user. */
export interface Record {
  $type: 'social.pmsky.vote'
  /** Optionally, CID specifying the specific version of 'uri' resource this vote applies to. */
  cid?: string
  /** Timestamp when this vote was created. */
  cts: string
  /** Signature of dag-cbor encoded vote. */
  sig?: Uint8Array
  /** the account creating the vote, not necessarily the same as the user who voted */
  src: string
  /** AT URI of the record, repository (account), or other resource that this vote applies to. */
  uri: string
  /** The value of the vote, either +1 or -1 */
  val: number
  [k: string]: unknown
}

const hashRecord = 'main'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true)
}
