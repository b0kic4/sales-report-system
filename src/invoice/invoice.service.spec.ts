import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { InvoiceService } from './invoice.service';
import { Invoice } from '../schemas/invoice.schema';
import { Model } from 'mongoose';

const mockInvoice = {
  _id: 'some-id',
  customer: 'John Doe',
  amount: 100,
  reference: 'INV-001',
  date: new Date(),
  items: [],
  save: jest.fn().mockResolvedValue(this),
};

const mockInvoiceModel = {
  save: jest.fn().mockResolvedValue(mockInvoice),
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(mockInvoice),
};

describe('InvoiceService', () => {
  let service: InvoiceService;
  let model: jest.Mocked<Model<Invoice>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken(Invoice.name),
          useValue: mockInvoiceModel,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    model = module.get<Model<Invoice>>(
      getModelToken(Invoice.name),
    ) as jest.Mocked<Model<Invoice>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new invoice', async () => {
      const createInvoiceDto = {
        customer: 'John Doe',
        amount: 100,
        reference: 'INV-001',
        date: new Date(),
        items: [],
      };

      const result = await service.create(createInvoiceDto);
      expect(result).toEqual(mockInvoice);
      expect(mockInvoiceModel.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all invoices', async () => {
      model.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue([mockInvoice]),
      } as any);
      const result = await service.findAll();
      expect(result).toEqual([mockInvoice]);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single invoice', async () => {
      const id = 'some-id';
      model.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockInvoice),
      } as any);

      const result = await service.findOne(id);
      expect(result).toEqual(mockInvoice);
      expect(model.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update an invoice', async () => {
      const id = 'some-id';
      const updateInvoiceDto = { amount: 200 };
      const updatedInvoice = { ...mockInvoice, amount: 200 };

      model.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(updatedInvoice),
      } as any);

      const result = await service.update(id, updateInvoiceDto);
      expect(result).toEqual(updatedInvoice);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updateInvoiceDto,
        { new: true },
      );
    });
  });

  describe('remove', () => {
    it('should delete an invoice', async () => {
      const id = 'some-id';
      model.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockInvoice),
      } as any);

      const result = await service.remove(id);
      expect(result).toEqual(mockInvoice);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });
});
