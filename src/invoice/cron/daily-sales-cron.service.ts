import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SalesReportService } from './sales-report.service';

@Injectable()
export class DailySalesCronService {
  constructor(private readonly salesReportService: SalesReportService) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async handleCron() {
    await this.salesReportService.generateDailySalesReport();
  }
}
