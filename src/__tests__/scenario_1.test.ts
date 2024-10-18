import request from 'supertest';
import { User } from '../modules/types';
import 'dotenv/config';

describe('server should perform basic operations', () => {
  const req = request(`http://localhost:${process.env.PORT}/api/users`);

  const user: User = {
    username: 'John Doe',
    age: 42,
    hobbies: ['hobby1', 'hobby2'],
  };

  const cleanDataBase = async () => {
    const users = await req.get('/');
    users.body.forEach(async (user: User) => await req.delete(`/${user.id}`));
  };

  beforeAll(cleanDataBase);
  afterAll(cleanDataBase);

  test('should create a new user and return it', async () => {
    const response = await req.post('/').send(user);
    user.id = response.body.id;

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(user);
  });

  test('should get the array with the created user', async () => {
    const response = await req.get('/');
    const isArray = Array.isArray(response.body);

    expect(response.statusCode).toBe(200);
    expect(isArray).toBeTruthy();
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toEqual(user);
  });

  test('should get the created user by id', async () => {
    const response = await req.get(`/${user.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(user);
  });

  test('should update the created user and return it by id ', async () => {
    const newUser: User = {
      username: 'Jane Doe',
      age: 21,
      hobbies: ['unknown hobby'],
    };

    const response = await req.put(`/${user.id}`).send(newUser);

    newUser.id = user.id;

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(newUser);
  });

  test('should delete the created user by id', async () => {
    const response = await req.delete(`/${user.id}`);

    expect(response.statusCode).toBe(204);
  });

  test('should get status code 404 when user is deleted', async () => {
    const response = await req.get(`/${user.id}`);

    expect(response.statusCode).toBe(404);
  });
});
