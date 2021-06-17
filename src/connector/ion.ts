import { grpc } from '@improbable-eng/grpc-web';

export interface IonService {
    name: string;
    connect(): void;
    connected: boolean;
    close(): void;
}

export class IonBaseConnector {
    public metadata: grpc.Metadata;
    public uri: string;
    public services: Map<string, IonService>;
    onopen?: (service: IonService) => void;
    onclose?: (service: IonService, ev: Event) => void;

    constructor(uri: string, token?: string) {
        this.uri = uri;
        this.metadata = new grpc.Metadata();
        this.services = new Map<string, IonService>();

        if (token) {
            this.metadata.append("authorization", token);
        }
    }

    public grpcClientRpcOptions(): grpc.ClientRpcOptions {
        return {
            host: this.uri,
            transport: grpc.WebsocketTransport(),
        };
    }

    public close(): void {
        this.services.forEach((service: IonService) => {
            if (service.connected) {
                service.close();
            }
        });
    }

    public onHeaders(service: IonService, headers: grpc.Metadata): void {
        // Merge metadata.
        headers.forEach((key, value) => {
            if (key.toLowerCase() !== "trailer" && key.toLowerCase() !== "content-type") {
                this.metadata.append(key, value);
            }
        });
        service.connected = true;
        this.onopen?.call(this, service);
    }

    public onEnd(service: IonService, status: grpc.Code, statusMessage: string, trailers: grpc.Metadata): void {
        service.connected = false;
        this.onclose?.call(this, service, new CustomEvent(service.name, { "detail": { status, statusMessage, trailers } }));
    }

    registerService(service: IonService) {
        this.services.set(service.name, service);
    }
}