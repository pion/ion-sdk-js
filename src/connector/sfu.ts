import { grpc } from '@improbable-eng/grpc-web';
import { IonService, IonBaseConnector } from './ion';
import { Signal, Trickle } from '../signal';
import Client, { Configuration } from '../client';
import { EventEmitter } from 'events';
import * as sfu_rpc from '../_library/proto/sfu/sfu_pb_service';
import * as pb from '../_library/proto/sfu/sfu_pb';
import { Uint8ArrayToJSONString } from '../signal/utils';
import { LocalStream, RemoteStream, Constraints } from '../stream';


export class IonSDKSFU implements IonService {
    name: string;
    connector: IonBaseConnector;
    connected: boolean;
    config?: Configuration;
    protected _rpc?: grpc.Client<pb.SignalRequest, pb.SignalReply>;
    private _sfu?: Client;
    private _sig?: IonSFUGRPCSignal;
    ontrack?: (track: MediaStreamTrack, stream: RemoteStream) => void;
    ondatachannel?: (ev: RTCDataChannelEvent) => void;
    onspeaker?: (ev: string[]) => void;

    constructor(connector: IonBaseConnector, config?: Configuration) {
        this.name = "sfu";
        this.config = config;
        this.connected = false;
        this.connector = connector;
        this.connector.registerService(this);
    }

    async join(sid: string, uid: string) {
        return this._sfu?.join(sid, uid);
    }

    leave() {
        return this._sfu?.leave();
    }

    getPubStats(selector?: MediaStreamTrack) {
        return this._sfu?.getPubStats(selector);
    }

    getSubStats(selector?: MediaStreamTrack) {
        return this._sfu?.getSubStats(selector);
    }

    publish(stream: LocalStream) {
        return this._sfu?.publish(stream);
    }

    createDataChannel(label: string) {
        return this._sfu?.createDataChannel(label);
    }

    connect(): void {
        if (!this._sig) {
            this._sig = new IonSFUGRPCSignal(this, this.connector);
        }
        if (!this._sfu) {
            this._sfu = new Client(this._sig, this?.config);
            this._sfu.ontrack = (track: MediaStreamTrack, stream: RemoteStream) =>
                this.ontrack?.call(this, track, stream);
            this._sfu.ondatachannel = (ev: RTCDataChannelEvent) =>
                this.ondatachannel?.call(this, ev);
            this._sfu.onspeaker = (ev: string[]) => this.onspeaker?.call(this, ev);
        }
    }

    close(): void {
        if (this._sfu) {
            this._sfu.close();
        }
    }
}

class IonSFUGRPCSignal implements Signal {
    connector: IonBaseConnector;
    protected _client: grpc.Client<pb.SignalRequest, pb.SignalReply>;
    private _event: EventEmitter;
    onnegotiate?: ((jsep: RTCSessionDescriptionInit) => void) | undefined;
    ontrickle?: ((trickle: Trickle) => void) | undefined;
    constructor(service: IonService, connector: IonBaseConnector) {
        this.connector = connector;
        this._event = new EventEmitter();
        const client = grpc.client(sfu_rpc.SFU.Signal, this.connector.grpcClientRpcOptions()) as grpc.Client<pb.SignalRequest, pb.SignalReply>;
        client.onEnd((status: grpc.Code, statusMessage: string, trailers: grpc.Metadata) =>
            connector.onEnd(service, status, statusMessage, trailers));
        client.onHeaders((headers: grpc.Metadata) => connector.onHeaders(service, headers));
        client.onMessage((reply: pb.SignalReply) => {
            switch (reply.getPayloadCase()) {
                case pb.SignalReply.PayloadCase.JOIN:
                    const answer = JSON.parse(Uint8ArrayToJSONString(reply.getJoin()?.getDescription() as Uint8Array));
                    this._event.emit('join-reply', answer);
                    break;
                case pb.SignalReply.PayloadCase.DESCRIPTION:
                    const desc = JSON.parse(Uint8ArrayToJSONString(reply.getDescription() as Uint8Array));
                    if (desc.type === 'offer') {
                        if (this.onnegotiate) this.onnegotiate(desc);
                    } else if (desc.type === 'answer') {
                        this._event.emit('description', desc);
                    }
                    break;
                case pb.SignalReply.PayloadCase.TRICKLE:
                    const pbTrickle = reply.getTrickle();
                    if (pbTrickle?.getInit() !== undefined) {
                        const candidate = JSON.parse(pbTrickle.getInit() as string);
                        const trickle = { target: pbTrickle.getTarget(), candidate };
                        if (this.ontrickle) this.ontrickle(trickle);
                    }
                    break;
                case pb.SignalReply.PayloadCase.ICECONNECTIONSTATE:
                case pb.SignalReply.PayloadCase.ERROR:
                    break;
            }
        });
        this._client = client;
        this._client.start(this.connector.metadata);
    }

    join(sid: string, uid: string, offer: RTCSessionDescriptionInit) {
        const request = new pb.SignalRequest();
        const join = new pb.JoinRequest();
        join.setSid(sid);
        join.setUid(uid);
        const buffer = Uint8Array.from(JSON.stringify(offer), (c) => c.charCodeAt(0));
        join.setDescription(buffer);
        request.setJoin(join);
        this._client.send(request);
        return new Promise<RTCSessionDescriptionInit>((resolve, reject) => {
            const handler = (desc: RTCSessionDescriptionInit) => {
                resolve({ type: 'answer', sdp: desc.sdp });
                this._event.removeListener('join-reply', handler);
            };
            this._event.addListener('join-reply', handler);
        });
    }

    trickle(trickle: Trickle) {
        const request = new pb.SignalRequest();
        const pbTrickle = new pb.Trickle();
        pbTrickle.setInit(JSON.stringify(trickle.candidate));
        request.setTrickle(pbTrickle);
        this._client.send(request);
    }

    offer(offer: RTCSessionDescriptionInit) {
        const request = new pb.SignalRequest();
        const buffer = Uint8Array.from(JSON.stringify(offer), (c) => c.charCodeAt(0));
        request.setDescription(buffer);
        this._client.send(request);

        return new Promise<RTCSessionDescriptionInit>((resolve, reject) => {
            const handler = (desc: RTCSessionDescriptionInit) => {
                resolve({ type: 'answer', sdp: desc.sdp });
                this._event.removeListener('description', handler);
            };
            this._event.addListener('description', handler);
        });
    }

    answer(answer: RTCSessionDescriptionInit) {
        const request = new pb.SignalRequest();
        const buffer = Uint8Array.from(JSON.stringify(answer), (c) => c.charCodeAt(0));
        request.setDescription(buffer);
        this._client.send(request);
    }

    close(): void {
        this._client?.close();
    }
}