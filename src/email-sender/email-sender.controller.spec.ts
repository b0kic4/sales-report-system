import { Test, TestingModule } from '@nestjs/testing';
import { EmailSenderController } from './email-sender.controller';
import { Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

describe('EmailSenderController', () => {
  let controller: EmailSenderController;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailSenderController],
    }).compile();

    controller = module.get<EmailSenderController>(EmailSenderController);
    logger = new Logger(EmailSenderController.name);
  });

  it('should process the sales report and send an email', async () => {
    const mockReport = { totalSales: 1000, itemsSold: 50 };

    const mockContext = {
      getChannelRef: jest.fn().mockReturnValue({
        ack: jest.fn(),
      }),
      getMessage: jest.fn(),
    } as unknown as RmqContext;

    const sendEmailSpy = jest
      .spyOn(controller, 'sendEmail')
      .mockResolvedValueOnce(true);

    await controller.handleSalesReport(mockReport, mockContext);

    expect(sendEmailSpy).toHaveBeenCalledWith(mockReport);

    expect(mockContext.getChannelRef().ack).toHaveBeenCalledWith(
      mockContext.getMessage(),
    );
  });

  it('should log an error if the report is missing', async () => {
    const mockContext = {
      getChannelRef: jest.fn().mockReturnValue({
        ack: jest.fn(),
      }),
      getMessage: jest.fn(),
    } as unknown as RmqContext;

    const loggerErrorSpy = jest.spyOn(controller['logger'], 'error');

    await controller.handleSalesReport(undefined, mockContext);

    expect(loggerErrorSpy).toHaveBeenCalledWith('No report received!');

    expect(mockContext.getChannelRef().ack).not.toHaveBeenCalled();
  });

  it('should mock the message on email sending failure', async () => {
    const mockReport = { totalSales: 1000, itemsSold: 50 };

    const mockContext = {
      getChannelRef: jest.fn().mockReturnValue({
        ack: jest.fn(),
        nack: jest.fn(),
      }),
      getMessage: jest.fn(),
    } as unknown as RmqContext;

    const sendEmailSpy = jest
      .spyOn(controller, 'sendEmail')
      .mockRejectedValueOnce(new Error('Failed to send email'));

    await controller.handleSalesReport(mockReport, mockContext);

    expect(sendEmailSpy).toHaveBeenCalledWith(mockReport);

    expect(mockContext.getChannelRef().nack).toHaveBeenCalledWith(
      mockContext.getMessage(),
    );
  });
});
