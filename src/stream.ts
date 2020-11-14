import { send } from 'process';
import Client, { Sender } from './client';

interface VideoConstraints {
  [name: string]: {
    resolution: MediaTrackConstraints;
    encodings: RTCRtpEncodingParameters;
  };
}

export const VideoConstraints: VideoConstraints = {
  qvga: {
    resolution: {
      width: { ideal: 320 },
      height: { ideal: 180 },
      frameRate: {
        ideal: 15,
        max: 30,
      },
    },
    encodings: {
      maxBitrate: 150_000,
      maxFramerate: 15.0,
    },
  },
  vga: {
    resolution: {
      width: { ideal: 640 },
      height: { ideal: 360 },
      frameRate: {
        ideal: 30,
        max: 60,
      },
    },
    encodings: {
      maxBitrate: 500_000,
      maxFramerate: 30.0,
    },
  },
  shd: {
    resolution: {
      width: { ideal: 960 },
      height: { ideal: 540 },
      frameRate: {
        ideal: 30,
        max: 60,
      },
    },
    encodings: {
      maxBitrate: 1_200_000,
      maxFramerate: 30.0,
    },
  },
  hd: {
    resolution: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: {
        ideal: 30,
        max: 60,
      },
    },
    encodings: {
      maxBitrate: 2_500_000,
      maxFramerate: 30.0,
    },
  },
  fhd: {
    resolution: {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: {
        ideal: 30,
        max: 60,
      },
    },
    encodings: {
      maxBitrate: 4_000_000,
      maxFramerate: 30.0,
    },
  },
  qhd: {
    resolution: {
      width: { ideal: 2560 },
      height: { ideal: 1440 },
      frameRate: {
        ideal: 30,
        max: 60,
      },
    },
    encodings: {
      maxBitrate: 8_000_000,
      maxFramerate: 30.0,
    },
  },
};

type Layer = 'none' | 'low' | 'medium' | 'high';

export interface Encoding {
  layer: Layer;
  maxBitrate: number;
  maxFramerate: number;
}

export interface Constraints extends MediaStreamConstraints {
  resolution: string;
  simulcast?: boolean;
  encodings?: Encoding[];
}

export interface LocalStream extends MediaStream {
  mute(kind: 'audio' | 'video'): void;
  unmute(kind: 'audio' | 'video'): void;
  publish(): void;
  unpublish(): void;
  switchDevice(kind: 'audio' | 'video', deviceId: string): void;
}

export function computeAudioConstraints(constraints: Constraints): MediaTrackConstraints {
  return !!constraints.audio as MediaTrackConstraints;
}

export function computeVideoConstraints(constraints: Constraints): MediaTrackConstraints {
  if (constraints.video instanceof Object) {
    return constraints.video;
  } else if (constraints.video && constraints.resolution) {
    return {
      ...VideoConstraints[constraints.resolution].resolution,
    };
  }
  return constraints.video as MediaTrackConstraints;
}

export function makeLocal(pc: RTCPeerConnection, sender: Sender, constraints: Constraints): LocalStream {
  const local = sender.stream as LocalStream;

  function getTrack(kind: 'audio' | 'video') {
    return sender.transceivers[kind].sender.track;
  }

  async function getNewTrack(kind: 'audio' | 'video') {
    const stream = await navigator.mediaDevices.getUserMedia({
      [kind]: kind === 'video' ? computeVideoConstraints(constraints) : computeAudioConstraints(constraints),
    });
    return stream.getTracks()[0];
  }

  async function publishTrack(track: MediaStreamTrack, transceiver: RTCRtpTransceiver) {
    if (track.kind === 'video' && constraints.simulcast) {
      const encodings: RTCRtpEncodingParameters[] = [
        {
          rid: 'f',
        },
        {
          rid: 'h',
          scaleResolutionDownBy: 2.0,
          maxBitrate: 150000,
        },
        {
          rid: 'q',
          scaleResolutionDownBy: 4.0,
          maxBitrate: 100000,
        },
      ];

      if (constraints.encodings) {
        constraints.encodings.forEach((encoding) => {
          switch (encoding.layer) {
            case 'high':
              if (encoding.maxBitrate) {
                encodings[0].maxBitrate = encoding.maxBitrate;
              }

              if (encoding.maxFramerate) {
                encodings[0].maxFramerate = encoding.maxFramerate;
              }
              break;
            case 'medium':
              if (encoding.maxBitrate) {
                encodings[1].maxBitrate = encoding.maxBitrate;
              }

              if (encoding.maxFramerate) {
                encodings[1].maxFramerate = encoding.maxFramerate;
              }
              break;
            case 'low':
              if (encoding.maxBitrate) {
                encodings[2].maxBitrate = encoding.maxBitrate;
              }

              if (encoding.maxFramerate) {
                encodings[2].maxFramerate = encoding.maxFramerate;
              }
              break;
          }
        });
      }
      const params = transceiver.sender.getParameters();
      await transceiver.sender.setParameters({ ...params, encodings });
      await transceiver.sender.replaceTrack(track);
      if (transceiver.currentDirection === 'inactive') transceiver.direction = 'sendonly';
    } else {
      const params = transceiver.sender.getParameters();
      if (track.kind === 'video') {
        await transceiver.sender.setParameters({
          ...params,
          encodings: [VideoConstraints[constraints.resolution].encodings],
        });
      }
      await transceiver.sender.replaceTrack(track);
      if (transceiver.currentDirection === 'inactive') transceiver.direction = 'sendonly';
    }
  }

  function updateTrack(next: MediaStreamTrack, prev: MediaStreamTrack | null, transceiver?: RTCRtpTransceiver) {
    local.addTrack(next);

    // If published, replace published track with track from new device
    if (prev && prev.enabled) {
      local.removeTrack(prev);
      prev.stop();

      if (transceiver) {
        transceiver.sender.track?.stop();
        transceiver.sender.replaceTrack(next);
      }
    } else {
      if (transceiver) {
        publishTrack(next, transceiver);
      }
    }
  }

  local.publish = () => {
    local.getTracks().forEach((t) => {
      publishTrack(t, sender.transceivers[t.kind as 'video' | 'audio']);
    });
  };

  local.unpublish = () => {
    sender.stream.removeTrack(sender.transceivers.audio.sender.track!);
    sender.stream.removeTrack(sender.transceivers.video.sender.track!);
    pc.removeTrack(sender.transceivers.audio.sender);
    pc.removeTrack(sender.transceivers.video.sender);
  };

  local.switchDevice = async (kind: 'audio' | 'video', deviceId: string) => {
    constraints = {
      ...constraints,
      [kind]:
        constraints[kind] instanceof Object
          ? {
              ...(constraints[kind] as object),
              deviceId,
            }
          : { deviceId },
    };

    const prev = getTrack(kind);
    const next = await getNewTrack(kind);

    pc.getTransceivers().forEach((t) => {
      if (t.sender.track === prev) {
        updateTrack(next, prev, t);
        return;
      }
    });
    updateTrack(next, prev);
  };

  local.mute = (kind: 'audio' | 'video') => {
    const track = getTrack(kind);
    if (track) {
      track.stop();
    }
  };

  local.unmute = async (kind: 'audio' | 'video') => {
    const prev = getTrack(kind);
    const track = await getNewTrack(kind);
    const transceiver = sender.transceivers[kind];

    if (transceiver.sender.track === prev) {
      updateTrack(track, prev, transceiver);
      return;
    }
    updateTrack(track, prev);
  };

  return local;
}

export interface RemoteStream extends MediaStream {
  api: RTCDataChannel;
  audio: boolean;
  video: Layer;
  _videoPreMute: Layer;

  preferLayer(layer: Layer): void;
  mute(kind: 'audio' | 'video'): void;
  unmute(kind: 'audio' | 'video'): void;
}

export function makeRemote(stream: MediaStream, api: RTCDataChannel): RemoteStream {
  const remote = stream as RemoteStream;
  remote.audio = true;
  remote.video = 'none';
  remote._videoPreMute = 'high';

  const select = () => {
    const call = {
      streamId: remote.id,
      video: remote.video,
      audio: remote.audio,
    };
    api.send(JSON.stringify(call));
  };

  remote.preferLayer = (layer: Layer) => {
    remote.video = layer;
    select();
  };

  remote.mute = (kind: 'audio' | 'video') => {
    if (kind === 'audio') {
      remote.audio = false;
    } else if (kind === 'video') {
      remote._videoPreMute = remote.video;
      remote.video = 'none';
    }
    select();
  };

  remote.unmute = (kind: 'audio' | 'video') => {
    if (kind === 'audio') {
      remote.audio = true;
    } else if (kind === 'video') {
      remote.video = remote._videoPreMute;
    }
    select();
  };

  return remote;
}
