import { RabbitMQService } from './services/rabbitmq.js';

const rabbitMQStringConnection = 'amqp://guest:secret@rabbitmq:5672';
const rabbitMQService = new RabbitMQService(rabbitMQStringConnection);

await rabbitMQService.connect();
