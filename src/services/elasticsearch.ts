import { Client } from '@elastic/elasticsearch';

export class ElasticsearchService {
  /**
   * Elasticsearch client instance.
   */
  private client: Client;

  /**
   * Creates an instance of Elasticsearch service.
   * @constructor
   * @param {string} node - The Elasticsearch node URL.
   */
  constructor() {
    this.client = new Client({
      node: process.env.ELASTIC_HOSTS || 'http://localhost:9200',
      auth: {
        username: process.env.ELASTIC_USERNAME || 'elastic',
        password: process.env.ELASTIC_PASSWORD || '',
      },
    });

    if (!this.client) {
      throw new Error('Elasticsearch client not created');
    }

    console.log('Elasticsearch client created');
  }

  /**
   * Saves the provided data to the specified Elasticsearch index.
   * @param index - The name of the Elasticsearch index to save the data to.
   * @param data - The data to save to the Elasticsearch index.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the data was saved successfully, or `false` otherwise.
   */
  async save(index: string, data: any): Promise<boolean> {
    try {
      const jsonData = typeof data === 'string' ? JSON.parse(data) : data;

      const response = await this.client.index({
        index,
        body: jsonData,
      });

      if (response.result === 'created') {
        console.log(`Data saved successfully to Elasticsearch index ${index}`);
        return true;
      } else {
        console.log(`Failed to save data to Elasticsearch index ${index}`);
        return false;
      }
    } catch (error) {
      console.error(`Failed to save data: ${error}`);
      return false;
    }
  }
}
