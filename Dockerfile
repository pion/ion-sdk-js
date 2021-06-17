FROM mhart/alpine-node:12

RUN npm i -g ts-protoc-gen@0.15.0
RUN apk --no-cache add protobuf make

WORKDIR /workspace

ENTRYPOINT ["make"]
