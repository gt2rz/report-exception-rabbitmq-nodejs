import client, { Connection, Channel, ConsumeMessage } from 'amqplib';

export class RabbitMQService {
  /**
   * The AMQP connection to the RabbitMQ server.
   */
  private connection: Connection | null = null;
  
  /**
   * The AMQP channel used for communication with the RabbitMQ server.
   */
  private channel: Channel | null = null;

  /**
   * Creates a new instance of the RabbitMQ service.
   * @param url The URL of the RabbitMQ server.
   */
  constructor(private url: string) {}

  /**
   * Connects to the RabbitMQ server.
   * @returns {Promise<void>}
   * @throws {Error} If the connection fails.
   */
  async connect() {
    try {
      this.connection = await client.connect(this.url);
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error(`Failed to connect to RabbitMQ: ${error}`);
      throw error;
    }
  }

  /**
   * Consume messages from a queue.
   * @param queue - The name of the queue to consume messages from.
   * @param onMessage - A callback function to handle each message received from the queue.
   * The function receives a `ConsumeMessage` object or `null` if the consumer was cancelled or closed.
   * @throws An error if the channel is not initialized or has been closed, or if the connection is not initialized.
   */
  async consume(queue: string, onMessage: (msg: ConsumeMessage | null) => void) {
    if (!this.channel) {
      throw new Error('Channel is not initialized or has been closed.');
    }

    if (!this.connection) {
      throw new Error('Connection is not initialized.');
    }

    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.consume(queue, onMessage);
  }

  /**
   * Sends a message to the specified queue.
   * @param queue - The name of the queue to send the message to.
   * @param message - The message to send to the queue.
   * @throws Error if the channel is not initialized or has been closed.
   */
  async sendToQueue(queue: string, message: string) {
    if (!this.channel) {
      throw new Error('Channel is not initialized or has been closed.');
    }

    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  /**
   * Closes the RabbitMQ connection if it exists.
   */
  async close() {
    if (this.connection) {
      await this.connection.close();
    }
  }
}
