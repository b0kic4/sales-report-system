import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RabbitMQPublisherService } from 'src/rabbit-mq/rabbit.mq.service';
import { Invoice } from 'src/schemas/invoice.schema';

@Injectable()
export class SalesReportService {
  private readonly logger = new Logger(SalesReportService.name);

  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    private readonly rabbitMQPublisherService: RabbitMQPublisherService,
  ) {}

  async generateDailySalesReport() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    const invoices = await this.invoiceModel
      .find({
        createdAt: {
          $gte: today,
          $lt: endOfDay,
        },
      })
      .exec();

    if (invoices.length === 0) {
      this.logger.log('No sales found for today.');
      return;
    }

    const totalSales = invoices.reduce(
      (acc, invoice) => acc + invoice.amount,
      0,
    );

    const skuQuantityMap = this.calculateTotalQuantityBySKU(invoices);

    const report = {
      totalSales,
      totalQuantitySold: skuQuantityMap,
      date: new Date(),
    };

    this.logger.log('Daily Sales Report: ', JSON.stringify(report));

    await this.rabbitMQPublisherService.publishNotification(
      'daily_sales_report',
      report,
    );

    this.logger.log('Report published to RabbitMQ successfully');
  }

  private calculateTotalQuantityBySKU(invoices: Invoice[]) {
    return invoices.reduce((skuMap, invoice) => {
      invoice.items.forEach((item) => {
        if (skuMap[item.sku]) {
          skuMap[item.sku].quantity += item.qt;
        } else {
          skuMap[item.sku] = {
            name: item.sku,
            quantity: item.qt,
          };
        }
      });
      return skuMap;
    }, {});
  }
}
