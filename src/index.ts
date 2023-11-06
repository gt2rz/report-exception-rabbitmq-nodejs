import dotenv from 'dotenv';
import { RabbitMQService } from './services/rabbitmq.js';

dotenv.config();

const rabbitMQStringConnection = `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
const rabbitMQService = new RabbitMQService(rabbitMQStringConnection);

try {
  await rabbitMQService.connect();

  const queue = process.env.RABBITMQ_QUEUE_NAME || 'default';

  await rabbitMQService.consume(queue, (message) => {
    if (message) {
      console.log(`Received message: ${message.content.toString()}`);
    }
  });
} catch (error) {
  console.error(`Failed to connect to RabbitMQ: ${error}`);
  await rabbitMQService.close();
  process.exit(1);
}

// console.log('Connected to RabbitMQ, waiting for messages...');
