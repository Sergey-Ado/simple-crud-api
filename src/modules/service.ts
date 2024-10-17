import { Res, User } from './types';
import { validateBody } from './utils.js';
import { v4 as newUuid } from 'uuid';

const dataBase: User[] = [];

export function get(id: string): Res {
  const user = dataBase.find((s) => s.id == id);
  if (!user) return { code: 404, message: "UserId doesn't exist" };
  return { code: 200, message: JSON.stringify(user) };
}

export function getAll(): Res {
  return { code: 200, message: JSON.stringify(dataBase) };
}

export function post(id: string, body: string): Res {
  if (!body) return { code: 400, message: 'Empty body' };

  const userBody = JSON.parse(body);
  const resValidate = validateBody(userBody);
  if (resValidate) return { code: 400, message: resValidate };

  const newUser = { id: newUuid(), ...userBody };
  dataBase.push(newUser);
  return { code: 201, message: JSON.stringify(newUser) };
}

export function put(id: string, body: string): Res {
  if (!body) return { code: 400, message: 'Empty body' };

  const userBody: Omit<User, 'id'> = JSON.parse(body);
  const resValidate = validateBody(userBody);
  if (resValidate) return { code: 400, message: resValidate };

  const user = dataBase.find((s) => s.id == id);

  if (!user) return { code: 404, message: "UserId doesn't exist" };

  user.username = userBody.username;
  user.age = userBody.age;
  user.hobbies = userBody.hobbies;
  return { code: 200, message: JSON.stringify(user) };
}

export function remove(id: string): Res {
  const userIndex = dataBase.findIndex((s) => s.id == id);
  if (userIndex == -1) return { code: 404, message: "UserId doesn't exist" };
  dataBase.splice(userIndex, 1);
  return { code: 204, message: '' };
}
