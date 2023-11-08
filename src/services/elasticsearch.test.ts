// import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
// import { ElasticsearchService } from './elasticsearch';
// import { Client } from '@elastic/elasticsearch';
// import { mocked } from 'ts-jest/utils';

// jest.mock('@elastic/elasticsearch');

// describe('ElasticsearchService', () => {
//   let service: ElasticsearchService;
//   const mockClient = {
//     index: jest.fn(),
//   };

//   beforeEach(() => {
//     mocked(Client).mockImplementation(() => mockClient as any);
//     service = new ElasticsearchService('http://localhost:9200');
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should create an instance of ElasticsearchService', () => {
//     expect(service).toBeInstanceOf(ElasticsearchService);
//   });

//   it('should save data to the specified index', async () => {
//     const index = 'test-index';
//     const data = { message: 'test message' };
//     mockClient.index.mockResolvedValueOnce({ statusCode: 200 } as any);

//     await service.save(index, data);

//     expect(mockClient.index).toHaveBeenCalledWith({
//       index,
//       body: data,
//     });
//   });

//   it('should handle error when saving data', async () => {
//     const index = 'test-index';
//     const data = { message: 'test message' };
//     const error = new Error('Failed to save data');
//     mockClient.index.mockRejectedValueOnce(error);

//     await service.save(index, data);

//     expect(mockClient.index).toHaveBeenCalledWith({
//       index,
//       body: data,
//     });
//     expect(console.error).toHaveBeenCalledWith(`Failed to save data: ${error}`);
//   });
// });
