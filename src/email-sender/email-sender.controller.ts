import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

@Controller('email-sender')
export class EmailSenderController {
  private readonly logger = new Logger(EmailSenderController.name);

  constructor() {
    this.logger.log(
      'EmailSenderController is ready and waiting for messages...',
    );
  }

  @EventPattern('daily_sales_report')
  async handleSalesReport(@Payload() report: any, @Ctx() context: RmqContext) {
    this.logger.log(
      `Received daily sales report in controller: ${JSON.stringify(report)}`,
    );

    if (!report) {
      this.logger.error('No report received!');
      return;
    }

    try {
      await this.sendEmail(report);

      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`Failed to process the report: ${error.message}`);
      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
      channel.nack(originalMessage);
    }
  }

  async sendEmail(report: any) {
    this.logger.log(`Sending email with the report: ${JSON.stringify(report)}`);

    this.logger.log(
      `Mock email sent to recipient@example.com with subject: Daily Sales Report`,
    );

    return Promise.resolve(true);
  }
}
