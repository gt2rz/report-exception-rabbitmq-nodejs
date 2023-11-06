import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RabbitMQService } from './rabbitmq';

describe('RabbitMQService', () => {
  const url = `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
  let service: RabbitMQService;

  beforeEach(() => {
    service = new RabbitMQService(url);
  });

  afterEach(async () => {
    await service.close();
  });

  it('should connect to RabbitMQ', async () => {
    await service.connect();
    expect(service['connection']).toBeDefined();
    expect(service['channel']).toBeDefined();
  });

  it('should throw an error if connection fails', async () => {
    const invalidUrl = 'amqp://invalid';
    const invalidService = new RabbitMQService(invalidUrl);
    await expect(invalidService.connect()).rejects.toThrow();
  });

  it('should consume messages from a queue', async () => {
    const queue = 'test-queue';
    const message = 'this is a test message';
    const onMessage = jest.fn();
    await service.connect();
    await service.sendToQueue(queue, message);
    await service.consume(queue, onMessage);
    expect(onMessage).toHaveBeenCalled();
  });

  it('should send a message to a queue', async () => {
    const queue = 'test-queue';
    const message = 'test-message';
    await service.connect();
    await service.sendToQueue(queue, message);
    await service.consume(queue, (msg) => {
      expect(msg?.content.toString()).toEqual(message);
    });
  });

  it('should throw an error if channel is not initialized when consume', async () => {
    await service.connect();
    service['channel'] = null;
    await expect(service.consume('test-queue', jest.fn())).rejects.toThrow('Channel is not initialized or has been closed.');
  });

  it('should throw an error if connection is not initialized when consume', async () => {
    await service.connect();
    service['connection'] = null;
    await expect(service.consume('test-queue', jest.fn())).rejects.toThrow('Connection is not initialized.');
  });

  it('should throw an error if channel is not initialized when consume', async () => {
    await service.connect();
    service['channel'] = null;
    await expect(service.consume('test-queue', jest.fn())).rejects.toThrow('Channel is not initialized or has been closed.');
  });

  it('should throw an error if connection is not initialized when send to queue', async () => {
    await service.connect();
    service['channel'] = null;
    await expect(service.sendToQueue('test-queue', 'this is a message')).rejects.toThrow('Channel is not initialized or has been closed.');
  });
});
