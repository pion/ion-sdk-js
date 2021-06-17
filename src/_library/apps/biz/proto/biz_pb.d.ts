// package: biz
// file: apps/biz/proto/biz.proto

import * as jspb from "google-protobuf";
import * as proto_ion_ion_pb from "../../../proto/ion/ion_pb";

export class Join extends jspb.Message {
  hasPeer(): boolean;
  clearPeer(): void;
  getPeer(): proto_ion_ion_pb.Peer | undefined;
  setPeer(value?: proto_ion_ion_pb.Peer): void;

  getToken(): string;
  setToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Join.AsObject;
  static toObject(includeInstance: boolean, msg: Join): Join.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Join, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Join;
  static deserializeBinaryFromReader(message: Join, reader: jspb.BinaryReader): Join;
}

export namespace Join {
  export type AsObject = {
    peer?: proto_ion_ion_pb.Peer.AsObject,
    token: string,
  }
}

export class JoinReply extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): void;

  getReason(): string;
  setReason(value: string): void;

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
    success: boolean,
    reason: string,
  }
}

export class Leave extends jspb.Message {
  getUid(): string;
  setUid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Leave.AsObject;
  static toObject(includeInstance: boolean, msg: Leave): Leave.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Leave, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Leave;
  static deserializeBinaryFromReader(message: Leave, reader: jspb.BinaryReader): Leave;
}

export namespace Leave {
  export type AsObject = {
    uid: string,
  }
}

export class LeaveReply extends jspb.Message {
  getReason(): string;
  setReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LeaveReply.AsObject;
  static toObject(includeInstance: boolean, msg: LeaveReply): LeaveReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LeaveReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LeaveReply;
  static deserializeBinaryFromReader(message: LeaveReply, reader: jspb.BinaryReader): LeaveReply;
}

export namespace LeaveReply {
  export type AsObject = {
    reason: string,
  }
}

export class SignalRequest extends jspb.Message {
  hasJoin(): boolean;
  clearJoin(): void;
  getJoin(): Join | undefined;
  setJoin(value?: Join): void;

  hasLeave(): boolean;
  clearLeave(): void;
  getLeave(): Leave | undefined;
  setLeave(value?: Leave): void;

  hasMsg(): boolean;
  clearMsg(): void;
  getMsg(): proto_ion_ion_pb.Message | undefined;
  setMsg(value?: proto_ion_ion_pb.Message): void;

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
    join?: Join.AsObject,
    leave?: Leave.AsObject,
    msg?: proto_ion_ion_pb.Message.AsObject,
  }

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    JOIN = 1,
    LEAVE = 2,
    MSG = 4,
  }
}

export class SignalReply extends jspb.Message {
  hasJoinreply(): boolean;
  clearJoinreply(): void;
  getJoinreply(): JoinReply | undefined;
  setJoinreply(value?: JoinReply): void;

  hasLeavereply(): boolean;
  clearLeavereply(): void;
  getLeavereply(): LeaveReply | undefined;
  setLeavereply(value?: LeaveReply): void;

  hasPeerevent(): boolean;
  clearPeerevent(): void;
  getPeerevent(): proto_ion_ion_pb.PeerEvent | undefined;
  setPeerevent(value?: proto_ion_ion_pb.PeerEvent): void;

  hasStreamevent(): boolean;
  clearStreamevent(): void;
  getStreamevent(): proto_ion_ion_pb.StreamEvent | undefined;
  setStreamevent(value?: proto_ion_ion_pb.StreamEvent): void;

  hasMsg(): boolean;
  clearMsg(): void;
  getMsg(): proto_ion_ion_pb.Message | undefined;
  setMsg(value?: proto_ion_ion_pb.Message): void;

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
    joinreply?: JoinReply.AsObject,
    leavereply?: LeaveReply.AsObject,
    peerevent?: proto_ion_ion_pb.PeerEvent.AsObject,
    streamevent?: proto_ion_ion_pb.StreamEvent.AsObject,
    msg?: proto_ion_ion_pb.Message.AsObject,
  }

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    JOINREPLY = 1,
    LEAVEREPLY = 2,
    PEEREVENT = 3,
    STREAMEVENT = 4,
    MSG = 5,
  }
}

