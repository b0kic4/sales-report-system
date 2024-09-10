import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    return 'Hello World!';
  }

  getMongoUri(): string {
    return this.configService.get<string>('MONGODB_URI');
  }

  getAmqpUrl(): string {
    return this.configService.get<string>('CLOUDAMQP_URL');
  }
}
