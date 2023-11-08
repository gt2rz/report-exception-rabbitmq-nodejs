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
  constructor(node: string) {
    this.client = new Client({ node });
  }

  /**
   * Saves the provided data to the specified Elasticsearch index.
   * @param index - The name of the Elasticsearch index to save the data to.
   * @param data - The data to save to the Elasticsearch index.
   */
  async save(index: string, data: any) {
    try {
      const response = await this.client.index({
        index,
        body: data,
      });

      console.log('Data saved successfully');

      // if (response?.statusCode === 200) {
      //   console.log('Data saved successfully');
      // } else {
      //   console.log('Failed to save data');
      // }
    } catch (error) {
      console.error(`Failed to save data: ${error}`);
    }
  }
}
