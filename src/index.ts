import dotenv from 'dotenv';
import { RabbitMQService } from './services/rabbitmq.js';

dotenv.config();

const rabbitMQStringConnection = `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
const rabbitMQService = new RabbitMQService(rabbitMQStringConnection);

await rabbitMQService.connect();

console.log('Connected to RabbitMQ');
