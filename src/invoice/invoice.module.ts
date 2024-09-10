import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from '../schemas/invoice.schema';
import { SalesReportService } from './cron/sales-report.service';
import { DailySalesCronService } from './cron/daily-sales-cron.service';
import { RabbitMQConfigModule } from 'src/rabbit-mq/rabbit-mq.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    RabbitMQConfigModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, SalesReportService, DailySalesCronService],
})
export class InvoiceModule {}
