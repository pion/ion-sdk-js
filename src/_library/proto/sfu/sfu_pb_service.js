// package: sfu
// file: proto/sfu/sfu.proto

var proto_sfu_sfu_pb = require("../../proto/sfu/sfu_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var SFU = (function () {
  function SFU() {}
  SFU.serviceName = "sfu.SFU";
  return SFU;
}());

SFU.Signal = {
  methodName: "Signal",
  service: SFU,
  requestStream: true,
  responseStream: true,
  requestType: proto_sfu_sfu_pb.SignalRequest,
  responseType: proto_sfu_sfu_pb.SignalReply
};

exports.SFU = SFU;

function SFUClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

SFUClient.prototype.signal = function signal(metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.client(SFU.Signal, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  client.onMessage(function (message) {
    listeners.data.forEach(function (handler) {
      handler(message);
    })
  });
  client.start(metadata);
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.SFUClient = SFUClient;

