import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { InvoiceModule } from './invoice.module';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../test/mongoose-test-utils';

describe('InvoiceController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // In-memory MongoDB for testing purposes
        rootMongooseTestModule(),
        InvoiceModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  });

  it('/invoice (POST) should create an invoice', () => {
    return request(app.getHttpServer())
      .post('/invoice')
      .send({
        customer: 'John Doe',
        amount: 100,
        reference: 'INV-001',
        date: new Date(),
        items: [],
      })
      .expect(201)
      .then((response) => {
        expect(response.body._id).toBeDefined();
        expect(response.body.customer).toBe('John Doe');
      });
  });

  it('/invoice (GET) should retrieve all invoices', () => {
    return request(app.getHttpServer())
      .get('/invoice')
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
      });
  });
});
