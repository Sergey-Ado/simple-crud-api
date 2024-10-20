import request from 'supertest';
import { User } from '../modules/types';
import 'dotenv/config';

const req = request(`http://localhost:${process.env.PORT || 3000}/`);
const endpoint = 'api/users/';

const cleanDataBase = async () => {
  const users = await req.get(endpoint);
  users.body.forEach(
    async (user: User) => await req.delete(endpoint + user.id)
  );
};

describe('Server should return the correct status code when a request with an incorrect body', () => {
  beforeAll(cleanDataBase);
  afterAll(cleanDataBase);

  test('should be a status code of 400 if the body does not contain required fields', async () => {
    let response = await req.post(endpoint).send({ age: 42, hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req.post(endpoint).send({ user: 'John Doe', hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req.post(endpoint).send({ uses: 'John Doe', age: 42 });
    expect(response.statusCode).toBe(400);

    response = await req
      .post(endpoint)
      .send({ username: 'John Doe', age: 42, hobbies: [] });
    expect(response.statusCode).toBe(201);

    const user: User = response.body;

    response = await req.put(endpoint + user.id).send({ age: 42, hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req
      .put(endpoint + user.id)
      .send({ user: 'John Doe', hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req
      .put(endpoint + user.id)
      .send({ uses: 'John Doe', age: 42 });
    expect(response.statusCode).toBe(400);

    response = await req.delete(endpoint + user.id);
    expect(response.statusCode).toBe(204);
  });

  test('should be a status code of 400 if the body contain invalid field', async () => {
    let response = await req.post(endpoint).send({
      username: 'John Doe',
      age: 42,
      hobbies: [],
      invalidProperty: false,
    });
    expect(response.statusCode).toBe(400);

    response = await req
      .post(endpoint)
      .send({ username: 'John Doe', age: 42, hobbies: [] });
    expect(response.statusCode).toBe(201);

    const user: User = response.body;

    response = await req.put(endpoint + user.id).send({
      username: 'John Doe',
      age: 42,
      hobbies: [],
      invalidProperty: false,
    });
    expect(response.statusCode).toBe(400);

    response = await req.delete(endpoint + user.id);
    expect(response.statusCode).toBe(204);
  });

  test('should be a status code of 400 if the body contains property with values ​​of an invalid type', async () => {
    let response = await req
      .post(endpoint)
      .send({ username: 42, age: 42, hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req
      .post(endpoint)
      .send({ username: 'John Doe', age: '42', hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req
      .post(endpoint)
      .send({ username: 'John Doe', age: 42, hobbies: 'hobbies' });
    expect(response.statusCode).toBe(400);

    response = await req
      .post(endpoint)
      .send({ username: 'John Doe', age: 42, hobbies: [false] });
    expect(response.statusCode).toBe(400);

    response = await req
      .post(endpoint)
      .send({ username: 'John Doe', age: 42, hobbies: [] });
    expect(response.statusCode).toBe(201);

    const user: User = response.body;

    response = await req
      .put(endpoint + user.id)
      .send({ username: 42, age: 42, hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req
      .put(endpoint + user.id)
      .send({ username: 'John Doe', age: '42', hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req
      .put(endpoint + user.id)
      .send({ username: 'John Doe', age: 42, hobbies: 'hobbies' });
    expect(response.statusCode).toBe(400);

    response = await req
      .put(endpoint + user.id)
      .send({ username: 'John Doe', age: 42, hobbies: [false] });
    expect(response.statusCode).toBe(400);

    response = await req.delete(endpoint + user.id);
    expect(response.statusCode).toBe(204);
  });
});
