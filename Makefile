all: download proto

proto-gen-from-docker:
	docker build -t ts-protoc .
	docker run -v $(CURDIR):/workspace ts-protoc proto

proto:
	mkdir -p src/_library
	protoc ./ion/proto/ion/ion.proto -I./ion --plugin=protoc-gen-ts=/usr/local/bin/protoc-gen-ts --js_out=import_style=commonjs,binary:./src/_library --ts_out=service=grpc-web:./src/_library
	protoc ./ion/proto/sfu/sfu.proto -I./ion --plugin=protoc-gen-ts=/usr/local/bin/protoc-gen-ts --js_out=import_style=commonjs,binary:./src/_library --ts_out=service=grpc-web:./src/_library
	protoc ./ion/apps/biz/proto/biz.proto -I./ion --plugin=protoc-gen-ts=/usr/local/bin/protoc-gen-ts --js_out=import_style=commonjs,binary:./src/_library --ts_out=service=grpc-web:./src/_library

download:
	git clone https://github.com/pion/ion -b refactor-business-logic --depth=1

clean:
	rm -rf src/_library