import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

const PROTO_PATH = path.join('proto', 'message.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const messageProto = grpc.loadPackageDefinition(packageDefinition).message as any;

function sendMessage(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): void {
  const response = `Received message: ${call.request.message}`;
  callback(null, { response });
}

function main(): void {
  const server = new grpc.Server();
  server.addService(messageProto.MessageService.service, { sendMessage });
  const address = '0.0.0.0:50051';
  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Server running at ${address}`);
    server.start();
  });
}

main();