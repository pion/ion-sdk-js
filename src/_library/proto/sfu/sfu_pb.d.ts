// package: sfu
// file: proto/sfu/sfu.proto

import * as jspb from "google-protobuf";

export class SignalRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasJoin(): boolean;
  clearJoin(): void;
  getJoin(): JoinRequest | undefined;
  setJoin(value?: JoinRequest): void;

  hasDescription(): boolean;
  clearDescription(): void;
  getDescription(): Uint8Array | string;
  getDescription_asU8(): Uint8Array;
  getDescription_asB64(): string;
  setDescription(value: Uint8Array | string): void;

  hasTrickle(): boolean;
  clearTrickle(): void;
  getTrickle(): Trickle | undefined;
  setTrickle(value?: Trickle): void;

  getPayloadCase(): SignalRequest.PayloadCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignalRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SignalRequest): SignalRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignalRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignalRequest;
  static deserializeBinaryFromReader(message: SignalRequest, reader: jspb.BinaryReader): SignalRequest;
}

export namespace SignalRequest {
  export type AsObject = {
    id: string,
    join?: JoinRequest.AsObject,
    description: Uint8Array | string,
    trickle?: Trickle.AsObject,
  }

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    JOIN = 2,
    DESCRIPTION = 3,
    TRICKLE = 4,
  }
}

export class SignalReply extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasJoin(): boolean;
  clearJoin(): void;
  getJoin(): JoinReply | undefined;
  setJoin(value?: JoinReply): void;

  hasDescription(): boolean;
  clearDescription(): void;
  getDescription(): Uint8Array | string;
  getDescription_asU8(): Uint8Array;
  getDescription_asB64(): string;
  setDescription(value: Uint8Array | string): void;

  hasTrickle(): boolean;
  clearTrickle(): void;
  getTrickle(): Trickle | undefined;
  setTrickle(value?: Trickle): void;

  hasIceconnectionstate(): boolean;
  clearIceconnectionstate(): void;
  getIceconnectionstate(): string;
  setIceconnectionstate(value: string): void;

  hasError(): boolean;
  clearError(): void;
  getError(): string;
  setError(value: string): void;

  getPayloadCase(): SignalReply.PayloadCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignalReply.AsObject;
  static toObject(includeInstance: boolean, msg: SignalReply): SignalReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignalReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignalReply;
  static deserializeBinaryFromReader(message: SignalReply, reader: jspb.BinaryReader): SignalReply;
}

export namespace SignalReply {
  export type AsObject = {
    id: string,
    join?: JoinReply.AsObject,
    description: Uint8Array | string,
    trickle?: Trickle.AsObject,
    iceconnectionstate: string,
    error: string,
  }

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    JOIN = 2,
    DESCRIPTION = 3,
    TRICKLE = 4,
    ICECONNECTIONSTATE = 5,
    ERROR = 6,
  }
}

export class JoinRequest extends jspb.Message {
  getSid(): string;
  setSid(value: string): void;

  getUid(): string;
  setUid(value: string): void;

  getDescription(): Uint8Array | string;
  getDescription_asU8(): Uint8Array;
  getDescription_asB64(): string;
  setDescription(value: Uint8Array | string): void;

  getConfigMap(): jspb.Map<string, string>;
  clearConfigMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JoinRequest.AsObject;
  static toObject(includeInstance: boolean, msg: JoinRequest): JoinRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JoinRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JoinRequest;
  static deserializeBinaryFromReader(message: JoinRequest, reader: jspb.BinaryReader): JoinRequest;
}

export namespace JoinRequest {
  export type AsObject = {
    sid: string,
    uid: string,
    description: Uint8Array | string,
    configMap: Array<[string, string]>,
  }
}

export class JoinReply extends jspb.Message {
  getDescription(): Uint8Array | string;
  getDescription_asU8(): Uint8Array;
  getDescription_asB64(): string;
  setDescription(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JoinReply.AsObject;
  static toObject(includeInstance: boolean, msg: JoinReply): JoinReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JoinReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JoinReply;
  static deserializeBinaryFromReader(message: JoinReply, reader: jspb.BinaryReader): JoinReply;
}

export namespace JoinReply {
  export type AsObject = {
    description: Uint8Array | string,
  }
}

export class Trickle extends jspb.Message {
  getTarget(): Trickle.TargetMap[keyof Trickle.TargetMap];
  setTarget(value: Trickle.TargetMap[keyof Trickle.TargetMap]): void;

  getInit(): string;
  setInit(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Trickle.AsObject;
  static toObject(includeInstance: boolean, msg: Trickle): Trickle.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Trickle, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Trickle;
  static deserializeBinaryFromReader(message: Trickle, reader: jspb.BinaryReader): Trickle;
}

export namespace Trickle {
  export type AsObject = {
    target: Trickle.TargetMap[keyof Trickle.TargetMap],
    init: string,
  }

  export interface TargetMap {
    PUBLISHER: 0;
    SUBSCRIBER: 1;
  }

  export const Target: TargetMap;
}

