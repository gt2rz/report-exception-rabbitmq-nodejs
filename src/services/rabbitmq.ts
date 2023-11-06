import client, { Connection, Channel, ConsumeMessage } from 'amqplib';

export class RabbitMQService {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  constructor(private url: string) {}

  async connect() {
    try {
      this.connection = await client.connect(this.url);
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error(`Failed to connect to RabbitMQ: ${error}`);
      throw error;
    }
  }

  async consume(queue: string, onMessage: (msg: ConsumeMessage | null) => void) {
    if (!this.channel) {
      throw new Error('Channel is not initialized.');
    }

    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, onMessage);
  }

  async ack(queue: string, message: ConsumeMessage) {
    if (!this.channel) {
      throw new Error('Channel is not initialized.');
    }

    this.channel.ack(message);
  }

  async sendToQueue(queue: string, message: string) {
    if (!this.channel) {
      throw new Error('Channel is not initialized.');
    }

    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
    }
  }
}