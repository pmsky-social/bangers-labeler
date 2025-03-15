/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../lexicons'
import { type $Typed, is$typed as _is$typed, type OmitKey } from '../../../util'

const is$typed = _is$typed,
  validate = _validate
const id = 'social.pmsky.proposal'

/** Some proposal that refers to another ATproto record.  Similar to `com.atproto.proposal.defs#label, but as a concrete record type. */
export interface Record {
  $type: 'social.pmsky.proposal'
  /** Optionally, CID specifying the specific version of 'uri' resource this proposal applies to. */
  cid?: string
  /** Timestamp when this proposal was created. */
  cts: string
  /** Timestamp at which this proposal expires (no longer applies). */
  exp?: string
  /** If true, this is a negation of a proposal, overwriting a previous proposal. */
  neg?: boolean
  /** Signature of dag-cbor encoded proposal. */
  sig?: Uint8Array
  /** DID of the actor who created this proposal. */
  src: string
  /** the type of proposal, currently expected values are 'allowed_user' or 'post_proposal' */
  typ: string
  /** AT URI of the record, repository (account), or other resource that this proposal applies to. */
  uri: string
  /** The short string name of the value or type of this proposal. */
  val: string
  /** The AT Protocol version of the proposal object. */
  ver?: number
  [k: string]: unknown
}

const hashRecord = 'main'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true)
}
