import { Inject, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  ParkingPropertiesService,
  ParkingPropertySubscriber,
} from './parking-properties.service';
import { ParkingProperty } from './entities/parking-property.entity';

// pain: https://github.com/nestjs/nest/issues/7649#issuecomment-964873444
@WebSocketGateway({
  cors: {
    origin: ['https://cloud-porsche.github.io', 'https://cloud-dev.ostabo.com'],
  },
})
export class ParkingPropertiesGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ParkingPropertySubscriber
{
  private readonly logger = new Logger(ParkingPropertiesGateway.name);

  @WebSocketServer() io: Server;

  constructor(
    private readonly parkingPropertyService: ParkingPropertiesService,
    //@Inject('SIMULATION_PARKING_PROPERTIES_SERVICE')
    //private readonly simParkingPropertyService: ParkingPropertiesService,
  ) {
    parkingPropertyService.addListener(this);
    //simParkingPropertyService.addListener(this);
  }

  // TODO: improve performance
  async changedParkingProperty(
    sender: ParkingPropertiesService,
    parkingProperties: ParkingProperty[],
  ) {
    // if (sender === this.simParkingPropertyService) {
    //   parkingProperties = [
    //     ...parkingProperties,
    //     ...(await this.parkingPropertyService.findAll()).filter(
    //       (property) =>
    //         parkingProperties.find((p) => p.id === property.id) === undefined,
    //     ),
    //   ];
    // }
    this.logger.debug('Parking property changed - Sending to clients');
    this.io.emit('parking-properties', parkingProperties);
  }

  afterInit() {
    this.logger.log('WS Initialized');
  }

  handleConnection(client: any, ..._: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id: ${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  handleMessage(client: any, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: 'pong',
      data: 'Wrong data that will make the test fail',
    };
  }
}
