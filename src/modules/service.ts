import { ResponseMessage, User } from './types';
import { validateBody } from './utils.js';
import { v4 as newUuid } from 'uuid';

const dataBase: User[] = [];

export function get(id: string): ResponseMessage {
  const user = dataBase.find((s) => s.id == id);
  console.log(user);
  if (!user)
    return { code: 404, message: JSON.stringify('UserId does not exist') };
  return { code: 200, message: user };
}

export function getAll(): ResponseMessage {
  return { code: 200, message: dataBase };
}

export function post(id: string, body: string): ResponseMessage {
  if (!body) return { code: 400, message: 'Empty body' };

  const userBody = JSON.parse(body);
  const resValidate = validateBody(userBody);
  if (resValidate) return { code: 400, message: resValidate };

  const newUser = { id: newUuid(), ...userBody };
  console.log(newUser);
  dataBase.push(newUser);
  return { code: 201, message: newUser };
}

export function put(id: string, body: string): ResponseMessage {
  if (!body) return { code: 400, message: 'Empty body' };

  const userBody: User = JSON.parse(body);
  const resValidate = validateBody(userBody);
  if (resValidate) return { code: 400, message: resValidate };

  const user = dataBase.find((s) => s.id == id);

  if (!user) return { code: 404, message: "UserId doesn't exist" };

  user.username = userBody.username;
  user.age = userBody.age;
  user.hobbies = userBody.hobbies;
  return { code: 200, message: user };
}

export function remove(id: string): ResponseMessage {
  const userIndex = dataBase.findIndex((s) => s.id == id);
  if (userIndex == -1) return { code: 404, message: "UserId doesn't exist" };
  dataBase.splice(userIndex, 1);
  return { code: 204, message: '' };
}
