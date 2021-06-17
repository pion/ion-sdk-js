// package: sfu
// file: proto/sfu/sfu.proto

import * as proto_sfu_sfu_pb from "../../proto/sfu/sfu_pb";
import {grpc} from "@improbable-eng/grpc-web";

type SFUSignal = {
  readonly methodName: string;
  readonly service: typeof SFU;
  readonly requestStream: true;
  readonly responseStream: true;
  readonly requestType: typeof proto_sfu_sfu_pb.SignalRequest;
  readonly responseType: typeof proto_sfu_sfu_pb.SignalReply;
};

export class SFU {
  static readonly serviceName: string;
  static readonly Signal: SFUSignal;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class SFUClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  signal(metadata?: grpc.Metadata): BidirectionalStream<proto_sfu_sfu_pb.SignalRequest, proto_sfu_sfu_pb.SignalReply>;
}

