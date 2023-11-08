import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import dotenv from 'dotenv';
import { RabbitMQService } from './services/rabbitmq';
import { ElasticsearchService } from './services/elasticsearch';

dotenv.config();

describe('Index', () => {
  const rabbitMQStringConnection = `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
  const rabbitMQService = new RabbitMQService(rabbitMQStringConnection);

  const nodeElasticSearch = process.env.ELASTICSEARCH_HOSTS || 'http://localhost:9200';
  const elasticsearchService = new ElasticsearchService(nodeElasticSearch);
  const elasticSearchIndex = process.env.ELASTICSEARCH_INDEX || 'default';

  beforeEach(async () => {
    await rabbitMQService.connect();
  });

  afterEach(async () => {
    await rabbitMQService.close();
  });

  it('should connect to RabbitMQ', async () => {
    expect(rabbitMQService['connection']).toBeDefined();
    expect(rabbitMQService['channel']).toBeDefined();
  });

  it('should consume messages from a queue and save to Elasticsearch', async () => {
    const queue = process.env.RABBITMQ_QUEUE_NAME || 'default';
    const message = 'this is a test message';
    const saveSpy = jest.spyOn(elasticsearchService, 'save');
    await rabbitMQService.sendToQueue(queue, message);
    await rabbitMQService.consume(queue, async (msg) => {
      if (msg) {
        await elasticsearchService.save(elasticSearchIndex, msg.content.toString());
      }
    });
    expect(saveSpy).toHaveBeenCalledWith(elasticSearchIndex, message);
  });

  it('should handle error when connection fails', async () => {
    const invalidUrl = 'amqp://invalid';
    const invalidService = new RabbitMQService(invalidUrl);
    await expect(invalidService.connect()).rejects.toThrow();
    expect(() => invalidService.close()).not.toThrow();
  });
});