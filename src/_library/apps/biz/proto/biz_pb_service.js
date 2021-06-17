// package: biz
// file: apps/biz/proto/biz.proto

var apps_biz_proto_biz_pb = require("../../../apps/biz/proto/biz_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Biz = (function () {
  function Biz() {}
  Biz.serviceName = "biz.Biz";
  return Biz;
}());

Biz.Signal = {
  methodName: "Signal",
  service: Biz,
  requestStream: true,
  responseStream: true,
  requestType: apps_biz_proto_biz_pb.SignalRequest,
  responseType: apps_biz_proto_biz_pb.SignalReply
};

exports.Biz = Biz;

function BizClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

BizClient.prototype.signal = function signal(metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.client(Biz.Signal, {
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

exports.BizClient = BizClient;

