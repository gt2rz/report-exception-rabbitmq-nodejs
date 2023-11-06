import { RabbitMQService } from '@/services/rabbitmq.js';

const rabbitMQStringConnection = 'amqp://localhost:5672';
const rabbitMQService = new RabbitMQService(rabbitMQStringConnection);

await rabbitMQService.connect();
