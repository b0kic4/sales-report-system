import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailSenderController } from './email-sender.controller';

@Module({
  imports: [ConfigModule],
  controllers: [EmailSenderController],
})
export class EmailSenderModule {}
