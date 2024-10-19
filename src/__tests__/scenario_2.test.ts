import request from 'supertest';
import 'dotenv/config';
import { v4 as uuid } from 'uuid';

const req = request(`http://localhost:${process.env.PORT || 3000}/`);
const endpoint = 'api/users/';
const randomUUID = uuid();

describe('Server should respond with correct status codes if path provided is invalid', () => {
  const cases = [
    [
      'invalidEndPoint',
      'api/invalidEndPoint',
      `api/users/${randomUUID}/invalidEndPoint`,
    ],
  ];

  test.each(cases)(
    'should status code 404 for request to %s',
    async (endPoint) => {
      let response = await req.get('' + endPoint);
      expect(response.statusCode).toBe(404);

      response = await req.post('' + endPoint);
      expect(response.statusCode).toBe(404);

      response = await req.put('' + endPoint);
      expect(response.statusCode).toBe(404);

      response = await req.delete('' + endPoint);
      expect(response.statusCode).toBe(404);
    }
  );

  test('should status code 404 for POST request to api/users/invalidEndPoint', async () => {
    const response = await req.post('invalidEndPoint');
    expect(response.statusCode).toBe(404);
  });

  test('should status code 400 for request with invalid id', async () => {
    let response = await req.get(endpoint + 'invalidId');
    expect(response.statusCode).toBe(400);

    response = await req.post(endpoint + 'invalidId');
    expect(response.statusCode).toBe(400);

    response = await req.put(endpoint + 'invalidId');
    expect(response.statusCode).toBe(400);

    response = await req.delete(endpoint + 'invalidId');
    expect(response.statusCode).toBe(400);
  });
});
