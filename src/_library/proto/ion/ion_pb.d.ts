// package: ion
// file: proto/ion/ion.proto

import * as jspb from "google-protobuf";

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

export class Track extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getLabel(): string;
  setLabel(value: string): void;

  getKind(): string;
  setKind(value: string): void;

  getSimulcastMap(): jspb.Map<string, string>;
  clearSimulcastMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Track.AsObject;
  static toObject(includeInstance: boolean, msg: Track): Track.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Track, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Track;
  static deserializeBinaryFromReader(message: Track, reader: jspb.BinaryReader): Track;
}

export namespace Track {
  export type AsObject = {
    id: string,
    label: string,
    kind: string,
    simulcastMap: Array<[string, string]>,
  }
}

export class Stream extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  clearTracksList(): void;
  getTracksList(): Array<Track>;
  setTracksList(value: Array<Track>): void;
  addTracks(value?: Track, index?: number): Track;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Stream.AsObject;
  static toObject(includeInstance: boolean, msg: Stream): Stream.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Stream, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Stream;
  static deserializeBinaryFromReader(message: Stream, reader: jspb.BinaryReader): Stream;
}

export namespace Stream {
  export type AsObject = {
    id: string,
    tracksList: Array<Track.AsObject>,
  }
}

export class Peer extends jspb.Message {
  getSid(): string;
  setSid(value: string): void;

  getUid(): string;
  setUid(value: string): void;

  getInfo(): Uint8Array | string;
  getInfo_asU8(): Uint8Array;
  getInfo_asB64(): string;
  setInfo(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Peer.AsObject;
  static toObject(includeInstance: boolean, msg: Peer): Peer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Peer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Peer;
  static deserializeBinaryFromReader(message: Peer, reader: jspb.BinaryReader): Peer;
}

export namespace Peer {
  export type AsObject = {
    sid: string,
    uid: string,
    info: Uint8Array | string,
  }
}

export class SessionEvent extends jspb.Message {
  getState(): SessionEvent.StateMap[keyof SessionEvent.StateMap];
  setState(value: SessionEvent.StateMap[keyof SessionEvent.StateMap]): void;

  getNid(): string;
  setNid(value: string): void;

  getSid(): string;
  setSid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SessionEvent.AsObject;
  static toObject(includeInstance: boolean, msg: SessionEvent): SessionEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SessionEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SessionEvent;
  static deserializeBinaryFromReader(message: SessionEvent, reader: jspb.BinaryReader): SessionEvent;
}

export namespace SessionEvent {
  export type AsObject = {
    state: SessionEvent.StateMap[keyof SessionEvent.StateMap],
    nid: string,
    sid: string,
  }

  export interface StateMap {
    ADD: 0;
    REMOVE: 1;
  }

  export const State: StateMap;
}

export class StreamEvent extends jspb.Message {
  getState(): StreamEvent.StateMap[keyof StreamEvent.StateMap];
  setState(value: StreamEvent.StateMap[keyof StreamEvent.StateMap]): void;

  getNid(): string;
  setNid(value: string): void;

  getSid(): string;
  setSid(value: string): void;

  getUid(): string;
  setUid(value: string): void;

  clearStreamsList(): void;
  getStreamsList(): Array<Stream>;
  setStreamsList(value: Array<Stream>): void;
  addStreams(value?: Stream, index?: number): Stream;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StreamEvent.AsObject;
  static toObject(includeInstance: boolean, msg: StreamEvent): StreamEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StreamEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StreamEvent;
  static deserializeBinaryFromReader(message: StreamEvent, reader: jspb.BinaryReader): StreamEvent;
}

export namespace StreamEvent {
  export type AsObject = {
    state: StreamEvent.StateMap[keyof StreamEvent.StateMap],
    nid: string,
    sid: string,
    uid: string,
    streamsList: Array<Stream.AsObject>,
  }

  export interface StateMap {
    ADD: 0;
    REMOVE: 1;
  }

  export const State: StateMap;
}

export class PeerEvent extends jspb.Message {
  getState(): PeerEvent.StateMap[keyof PeerEvent.StateMap];
  setState(value: PeerEvent.StateMap[keyof PeerEvent.StateMap]): void;

  hasPeer(): boolean;
  clearPeer(): void;
  getPeer(): Peer | undefined;
  setPeer(value?: Peer): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PeerEvent.AsObject;
  static toObject(includeInstance: boolean, msg: PeerEvent): PeerEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PeerEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PeerEvent;
  static deserializeBinaryFromReader(message: PeerEvent, reader: jspb.BinaryReader): PeerEvent;
}

export namespace PeerEvent {
  export type AsObject = {
    state: PeerEvent.StateMap[keyof PeerEvent.StateMap],
    peer?: Peer.AsObject,
  }

  export interface StateMap {
    JOIN: 0;
    UPDATE: 1;
    LEAVE: 2;
  }

  export const State: StateMap;
}

export class Message extends jspb.Message {
  getFrom(): string;
  setFrom(value: string): void;

  getTo(): string;
  setTo(value: string): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Message.AsObject;
  static toObject(includeInstance: boolean, msg: Message): Message.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Message;
  static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message;
}

export namespace Message {
  export type AsObject = {
    from: string,
    to: string,
    data: Uint8Array | string,
  }
}

export class RPC extends jspb.Message {
  getProtocol(): string;
  setProtocol(value: string): void;

  getAddr(): string;
  setAddr(value: string): void;

  getParamsMap(): jspb.Map<string, string>;
  clearParamsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RPC.AsObject;
  static toObject(includeInstance: boolean, msg: RPC): RPC.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RPC, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RPC;
  static deserializeBinaryFromReader(message: RPC, reader: jspb.BinaryReader): RPC;
}

export namespace RPC {
  export type AsObject = {
    protocol: string,
    addr: string,
    paramsMap: Array<[string, string]>,
  }
}

export class Node extends jspb.Message {
  getDc(): string;
  setDc(value: string): void;

  getNid(): string;
  setNid(value: string): void;

  getService(): string;
  setService(value: string): void;

  hasRpc(): boolean;
  clearRpc(): void;
  getRpc(): RPC | undefined;
  setRpc(value?: RPC): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Node.AsObject;
  static toObject(includeInstance: boolean, msg: Node): Node.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Node, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Node;
  static deserializeBinaryFromReader(message: Node, reader: jspb.BinaryReader): Node;
}

export namespace Node {
  export type AsObject = {
    dc: string,
    nid: string,
    service: string,
    rpc?: RPC.AsObject,
  }
}

