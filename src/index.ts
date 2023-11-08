import dotenv from 'dotenv';
import { RabbitMQService } from './services/rabbitmq.js';
import { ElasticsearchService } from './services/elasticsearch.js';

dotenv.config();

const rabbitMQStringConnection = `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
const rabbitMQService = new RabbitMQService(rabbitMQStringConnection);

const nodeElasticSearch = process.env.ELASTICSEARCH_HOSTS || 'http://localhost:9200';
const elasticsearchService = new ElasticsearchService(nodeElasticSearch);
const elasticSearchIndex = process.env.ELASTICSEARCH_INDEX || 'default';

try {
  await rabbitMQService.connect();

  const queue = process.env.RABBITMQ_QUEUE_NAME || 'default';

  await rabbitMQService.consume(queue, async (message) => {
    if (message) {
      // console.log(`Received message: ${message.content.toString()}`);
      await elasticsearchService.save(elasticSearchIndex, message.content.toString());
    }
  });
} catch (error) {
  console.error(`A ocurred an error: ${error}`);
  await rabbitMQService.close();
  process.exit(1);
}

console.log('Connected to RabbitMQ, waiting for messages...');
