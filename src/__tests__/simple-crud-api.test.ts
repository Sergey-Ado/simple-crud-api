import request from 'supertest';
import { User } from '../modules/types';
import 'dotenv/config';
import { v4 as uuid } from 'uuid';

const req = request(`http://localhost:${process.env.PORT || 3000}/`);
const endpoint = 'api/users/';

const cleanDataBase = async () => {
  const users = await req.get(endpoint);
  users.body.forEach(
    async (user: User) => await req.delete(endpoint + user.id)
  );
};

describe('server should perform basic operations', () => {
  beforeAll(cleanDataBase);
  afterAll(cleanDataBase);

  const user: User = {
    username: 'John Doe',
    age: 42,
    hobbies: ['hobby1', 'hobby2'],
  };

  test('should create a new user and return it', async () => {
    const response = await req.post(endpoint).send(user);
    user.id = response.body.id;

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(user);
  });

  test('should get the array with the created user', async () => {
    const response = await req.get(endpoint);
    const isArray = Array.isArray(response.body);

    expect(response.statusCode).toBe(200);
    expect(isArray).toBeTruthy();
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toEqual(user);
  });

  test('should get the created user by id', async () => {
    const response = await req.get(endpoint + user.id);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(user);
  });

  test('should update the created user and return it by id ', async () => {
    const newUser: User = {
      username: 'Jane Doe',
      age: 21,
      hobbies: ['unknown hobby'],
    };

    const response = await req.put(endpoint + user.id).send(newUser);

    newUser.id = user.id;

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(newUser);
  });

  test('should delete the created user by id', async () => {
    const response = await req.delete(endpoint + user.id);

    expect(response.statusCode).toBe(204);
  });

  test('should be a status code 404 when making a request to a remote user', async () => {
    const response = await req.get(endpoint + user.id);

    expect(response.statusCode).toBe(404);
  });
});

describe('Server should respond with correct status codes if path provided is invalid', () => {
  beforeAll(cleanDataBase);
  afterAll(cleanDataBase);

  const randomUUID = uuid();

  const cases = [
    [
      'invalidEndPoint',
      'api/invalidEndPoint',
      `api/users/${randomUUID}/invalidEndPoint`,
    ],
  ];

  test.each(cases)(
    'should be a status code 404 for request to %s',
    async (endPoint) => {
      let response = await req.get(endPoint);
      expect(response.statusCode).toBe(404);

      response = await req.post(endPoint);
      expect(response.statusCode).toBe(404);

      response = await req.put(endPoint);
      expect(response.statusCode).toBe(404);

      response = await req.delete(endPoint);
      expect(response.statusCode).toBe(404);
    }
  );

  test('should be a status code 404 for POST request to api/users/invalidEndPoint', async () => {
    const response = await req.post('invalidEndPoint');
    expect(response.statusCode).toBe(404);
  });

  test('should be a status code 400 for request with invalid id', async () => {
    let response = await req.get(endpoint + 'invalidId');
    expect(response.statusCode).toBe(400);

    response = await req.post(endpoint + 'invalidId');
    expect(response.statusCode).toBe(400);

    response = await req.put(endpoint + 'invalidId');
    expect(response.statusCode).toBe(400);

    response = await req.delete(endpoint + 'invalidId');
    expect(response.statusCode).toBe(400);
  });

  test('should be a status code of 404 for a request with a non-existent id', async () => {
    let response = await req.get(endpoint + randomUUID);
    expect(response.statusCode).toBe(404);

    response = await req.put(endpoint + randomUUID);
    expect(response.statusCode).toBe(404);

    response = await req.delete(endpoint + randomUUID);
    expect(response.statusCode).toBe(404);
  });
});

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
