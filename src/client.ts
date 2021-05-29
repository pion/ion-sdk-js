import { Signal } from './signal';
import { LocalStream, makeRemote, RemoteStream } from './stream';

const API_CHANNEL = 'ion-sfu';
const ERR_NO_SESSION = 'no active session, join first';

export interface Sender {
  stream: MediaStream;
  transceivers: { [kind in 'video' | 'audio']: RTCRtpTransceiver };
}

export interface Configuration extends RTCConfiguration {
  codec: 'vp8' | 'vp9' | 'h264';
}

export interface Trickle {
  candidate: RTCIceCandidateInit;
  target: Role;
}

export interface ActiveLayer {
  streamId: string;
  activeLayer: string;
  availableLayers: string[];
}

enum Role {
  pub = 0,
  sub = 1,
}

type Transports<T extends string | symbol | number, U> = {
  [K in T]: U;
};

export class Transport {
  api?: RTCDataChannel;
  signal: Signal;
  pc: RTCPeerConnection;
  candidates: RTCIceCandidateInit[];

  constructor(role: Role, signal: Signal, config: RTCConfiguration) {
    this.signal = signal;
    this.pc = new RTCPeerConnection(config);
    this.candidates = [];

    if (role === Role.pub) {
      this.pc.createDataChannel(API_CHANNEL);
    }

    this.pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        this.signal.trickle({ target: role, candidate });
      }
    };

    this.pc.oniceconnectionstatechange = async (e) => {
      if (this.pc.iceConnectionState === 'disconnected') {
        if (this.pc.restartIce) {
          // this will trigger onNegotiationNeeded
          this.pc.restartIce();
        }
      }
    };
  }
}

export default class Client {
  transports?: Transports<Role, Transport>;
  private config: Configuration;
  private signal: Signal;

  ontrack?: (track: MediaStreamTrack, stream: RemoteStream) => void;
  ondatachannel?: (ev: RTCDataChannelEvent) => void;
  onspeaker?: (ev: string[]) => void;
  onerrnegotiate?: (
    role: Role,
    err: Error,
    offer?: RTCSessionDescriptionInit,
    answer?: RTCSessionDescriptionInit,
  ) => void;
  onactivelayer?: (al: ActiveLayer) => void;

  constructor(
    signal: Signal,
    config: Configuration = {
      codec: 'vp8',
      iceServers: [
        {
          urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
        },
      ],
    },
  ) {
    this.signal = signal;
    this.config = config;

    signal.onnegotiate = this.negotiate.bind(this);
    signal.ontrickle = this.trickle.bind(this);
  }

  async join(sid: string, uid: string) {
    this.transports = {
      [Role.pub]: new Transport(Role.pub, this.signal, this.config),
      [Role.sub]: new Transport(Role.sub, this.signal, this.config),
    };

    this.transports[Role.sub].pc.ontrack = (ev: RTCTrackEvent) => {
      const stream = ev.streams[0];
      const remote = makeRemote(stream, this.transports![Role.sub]);

      if (this.ontrack) {
        this.ontrack(ev.track, remote);
      }
    };

    const apiReady = new Promise<void>((resolve) => {
      this.transports![Role.sub].pc.ondatachannel = (ev: RTCDataChannelEvent) => {
        if (ev.channel.label === API_CHANNEL) {
          this.transports![Role.sub].api = ev.channel;
          this.transports![Role.pub].api = ev.channel;
          ev.channel.onmessage = (e) => {
            try {
              const msg = JSON.parse(e.data);
              this.processChannelMessage(msg);
            } catch (err) {
              /* tslint:disable-next-line:no-console */
              console.error(err);
            }
          };
          resolve();
          return;
        }

        if (this.ondatachannel) {
          this.ondatachannel(ev);
        }
      };
    });

    const offer = await this.transports[Role.pub].pc.createOffer();
    await this.transports[Role.pub].pc.setLocalDescription(offer);
    const answer = await this.signal.join(sid, uid, offer);

    await this.transports[Role.pub].pc.setRemoteDescription(answer);
    this.transports[Role.pub].candidates.forEach((c) => this.transports![Role.pub].pc.addIceCandidate(c));
    this.transports[Role.pub].pc.onnegotiationneeded = this.onNegotiationNeeded.bind(this);

    return apiReady;
  }

  leave() {
    if (this.transports) {
      Object.values(this.transports).forEach((t) => t.pc.close());
      delete this.transports;
    }
  }

  getPubStats(selector?: MediaStreamTrack) {
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }
    return this.transports[Role.pub].pc.getStats(selector);
  }

  getSubStats(selector?: MediaStreamTrack) {
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }
    return this.transports[Role.sub].pc.getStats(selector);
  }

  publish(stream: LocalStream) {
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }
    stream.publish(this.transports[Role.pub]);
  }

  restartIce() {
    this.renegotiate(true)
  }

  createDataChannel(label: string) {
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }
    return this.transports[Role.pub].pc.createDataChannel(label);
  }

  close() {
    if (this.transports) {
      Object.values(this.transports).forEach((t) => t.pc.close());
    }
    this.signal.close();
  }

  private trickle({ candidate, target }: Trickle) {
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }
    if (this.transports[target].pc.remoteDescription) {
      this.transports[target].pc.addIceCandidate(candidate);
    } else {
      this.transports[target].candidates.push(candidate);
    }
  }

  private async negotiate(description: RTCSessionDescriptionInit) {
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }

    let answer: RTCSessionDescriptionInit | undefined;
    try {
      await this.transports[Role.sub].pc.setRemoteDescription(description);
      this.transports[Role.sub].candidates.forEach((c) => this.transports![Role.sub].pc.addIceCandidate(c));
      this.transports[Role.sub].candidates = [];
      answer = await this.transports[Role.sub].pc.createAnswer();
      await this.transports[Role.sub].pc.setLocalDescription(answer);
      this.signal.answer(answer);
    } catch (err) {
      /* tslint:disable-next-line:no-console */
      console.error(err);
      if (this.onerrnegotiate) this.onerrnegotiate(Role.sub, err, description, answer);
    }
  }

  private onNegotiationNeeded() {
    this.renegotiate(false)
  }

  private async renegotiate(iceRestart: boolean) {
    if (!this.transports) {
      throw Error(ERR_NO_SESSION);
    }

    let offer: RTCSessionDescriptionInit | undefined;
    let answer: RTCSessionDescriptionInit | undefined;
    try {
      offer = await this.transports[Role.pub].pc.createOffer({ iceRestart });
      await this.transports[Role.pub].pc.setLocalDescription(offer);
      answer = await this.signal.offer(offer);
      await this.transports[Role.pub].pc.setRemoteDescription(answer);
    } catch (err) {
      /* tslint:disable-next-line:no-console */
      console.error(err);
      if (this.onerrnegotiate) this.onerrnegotiate(Role.pub, err, offer, answer);
    }
  }

  private processChannelMessage(msg: any) {
    if (msg.method !== undefined && msg.params !== undefined) {
      switch (msg.method) {
        case 'audioLevels':
          if (this.onspeaker) {
            this.onspeaker(msg.params);
          }
          break;
        case 'activeLayer':
          if (this.onactivelayer) {
            this.onactivelayer(msg.params);
          }
          break;
        default:
        // do nothing
      }
    } else {
      // legacy channel message - payload contains audio levels
      if (this.onspeaker) {
        this.onspeaker(msg);
      }
    }
  }
}
