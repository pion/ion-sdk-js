import { grpc } from '@improbable-eng/grpc-web';
import { IonService, IonBaseConnector } from './ion';
import * as biz from '../_library/apps/biz/proto/biz_pb';
import * as ion from '../_library/proto/ion/ion_pb';
import * as biz_rpc from '../_library/apps/biz/proto/biz_pb_service';
import { EventEmitter } from 'events';
import { Uint8ArrayToJSONString } from '../signal/utils';

export interface JoinResult {
    success: boolean;
    reason: string;
}

export enum PeerState {
    NONE,
    JOIN,
    UPDATE,
    LEAVE,
}

export interface Peer {
    uid: string;
    sid: string;
    info: Map<string, any>;
}

export interface PeerEvent {
    state: PeerState;
    peer: Peer;
}

export enum StreamState {
    NONE,
    ADD,
    REMOVE,
}

export interface StreamEvent {
    uid: string;
    state: StreamState;
    streams: Stream[];
}

export interface Track {
    id: string;
    label: string;
    kind: string;
    simulcast: Map<string, string>;
}

export interface Stream {
    id: string;
    tracks: Track[];
}

export interface Message {
    from: string;
    to: string;
    data: Map<string, any>;
}

export class IonAppBiz implements IonService {
    name: string;
    connector: IonBaseConnector;
    connected: boolean;
    _rpc?: IonBizGRPCClient;
    onerror?: (err: Event) => void;
    onjoin?: (success: boolean, reason: string) => void;
    onleave?: (reason: string) => void;
    onpeerevent?: (ev: PeerEvent) => void;
    onstreamevent?: (ev: StreamEvent) => void;
    onmessage?: (msg: Message) => void;

    constructor(connector: IonBaseConnector) {
        this.name = "biz";
        this.connected = false;
        this.connector = connector;
        this.connector.registerService(this);
    }

    async join(
        sid: string,
        uid: string,
        info: Map<string, any>): Promise<JoinResult | undefined> {
        return this._rpc?.join(sid, uid, info);
    }

    async leave(uid: string): Promise<string | undefined> {
        return this._rpc?.leave(uid);
    }

    async message(from: string, to: string, data: Map<string, any>): Promise<void> {
        return this._rpc?.sendMessage(from, to, data);
    }

    connect(): void {
        if (!this._rpc) {
            this._rpc = new IonBizGRPCClient(this, this.connector);
            this._rpc.on("join-reply", async (success: boolean, reason: string) => {
                this.onjoin?.call(this, success, reason);
            });
            this._rpc.on("leave-reply", (reason: string) => this.onleave?.call(this, reason));
            this._rpc.on("peer-event", (ev: PeerEvent) => this.onpeerevent?.call(this, ev));
            this._rpc.on("stream-event", (ev: StreamEvent) => this.onstreamevent?.call(this, ev));
            this._rpc.on("message", (msg: Message) => this.onmessage?.call(this, msg));
        }
    }

    close(): void {
        if (this._rpc) {
            this._rpc.close();
        }
    }
}

class IonBizGRPCClient extends EventEmitter {
    connector: IonBaseConnector;
    protected _client: grpc.Client<biz.SignalRequest, biz.SignalReply>;
    constructor(service: IonService, connector: IonBaseConnector) {
        super();
        this.connector = connector;
        const client = grpc.client(biz_rpc.Biz.Signal, connector.grpcClientRpcOptions()) as grpc.Client<biz.SignalRequest, biz.SignalReply>;

        client.onEnd((status: grpc.Code, statusMessage: string, trailers: grpc.Metadata) =>
            connector.onEnd(service, status, statusMessage, trailers));
        client.onHeaders((headers: grpc.Metadata) => connector.onHeaders(service, headers));

        client.onMessage((reply: biz.SignalReply) => {
            switch (reply.getPayloadCase()) {
                case biz.SignalReply.PayloadCase.JOINREPLY:
                    const result = { success: reply.getJoinreply()?.getSuccess() || false, reason: reply.getJoinreply()?.getReason() || "unkown reason" };
                    this.emit('join-reply', result.success, result.reason);
                    break;
                case biz.SignalReply.PayloadCase.LEAVEREPLY:
                    const reason = reply.getLeavereply()?.getReason() || "unkown reason";
                    this.emit('leave-reply', reason);
                    break;
                case biz.SignalReply.PayloadCase.PEEREVENT:
                    {
                        const evt = reply.getPeerevent();
                        let state = PeerState.NONE;
                        const info = JSON.parse(Uint8ArrayToJSONString(evt?.getPeer()?.getInfo() as Uint8Array));
                        switch (evt?.getState()) {
                            case ion.PeerEvent.State.JOIN:
                                state = PeerState.JOIN;
                                break;
                            case ion.PeerEvent.State.UPDATE:
                                state = PeerState.UPDATE;

                                break;
                            case ion.PeerEvent.State.LEAVE:
                                state = PeerState.LEAVE;
                                break;
                        }
                        const peer = {
                            uid: evt?.getPeer()?.getUid() || "",
                            sid: evt?.getPeer()?.getSid() || "",
                            info: info || {},
                        }
                        this.emit("peer-event", { state, peer });
                    }
                    break;
                case biz.SignalReply.PayloadCase.STREAMEVENT:
                    {
                        const evt = reply.getStreamevent();
                        let state = StreamState.NONE;
                        switch (evt?.getState()) {
                            case ion.StreamEvent.State.ADD:
                                state = StreamState.ADD;
                                break;
                            case ion.StreamEvent.State.REMOVE:
                                state = StreamState.REMOVE;
                                break;
                        };
                        const sid = evt?.getSid() || "";
                        const uid = evt?.getUid() || "";
                        const streams = Array<any>();
                        evt?.getStreamsList().forEach((ionStream: ion.Stream) => {
                            const tracks = Array<any>();
                            ionStream.getTracksList().forEach((ionTrack: ion.Track) => {
                                const track = {
                                    id: ionTrack.getId(),
                                    label: ionTrack.getLabel(),
                                    kind: ionTrack.getKind(),
                                    simulcast: ionTrack.getSimulcastMap(),
                                }
                                tracks.push(track);
                            });
                            const stream = {
                                id: ionStream.getId(),
                                tracks: tracks || [],
                            }
                            streams.push(stream);
                        });
                        this.emit("stream-event", { state, sid, uid, streams });
                    }
                    break;
                case biz.SignalReply.PayloadCase.MSG:
                    const data = JSON.parse(Uint8ArrayToJSONString(reply.getMsg()?.getData() as Uint8Array));
                    const msg = { from: reply.getMsg()?.getFrom() || "", to: reply.getMsg()?.getTo() || "", data: data || {} };
                    this.emit('message', msg);
                    break;
            }
        });

        this._client = client;
        this._client.start(connector.metadata);
    }

    async join(sid: string, uid: string, info: Map<string, any>): Promise<JoinResult> {
        const request = new biz.SignalRequest();
        const join = new biz.Join();
        const peer = new ion.Peer();
        peer.setSid(sid);
        peer.setUid(uid);

        const buffer = Uint8Array.from(JSON.stringify(info), (c) => c.charCodeAt(0));
        peer.setInfo(buffer);

        join.setPeer(peer);
        request.setJoin(join);

        this._client.send(request);

        return new Promise<JoinResult>((resolve, reject) => {
            const handler = (result: JoinResult) => {
                resolve(result);
                this.removeListener('join-reply', handler);
            };
            this.addListener('join-reply', handler);
        });
    }

    async leave(uid: string) {
        const request = new biz.SignalRequest();
        const leave = new biz.Leave();
        leave.setUid(uid);
        request.setLeave(leave);

        this._client.send(request);

        return new Promise<string>((resolve, reject) => {
            const handler = (reason: string) => {
                resolve(reason);
                this.removeListener('join-reply', handler);
            };
            this.addListener('join-reply', handler);
        });
    }

    async sendMessage(from: string, to: string, data: Map<string, any>) {
        const request = new biz.SignalRequest();
        const message = new ion.Message();
        message.setFrom(from);
        message.setTo(to);
        const buffer = Uint8Array.from(JSON.stringify(data), (c) => c.charCodeAt(0));
        message.setData(buffer);
        request.setMsg(message);
        this._client.send(request);
    }

    close() {
        this._client.finishSend();
    }
}