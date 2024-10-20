import { IncomingMessage } from 'http';
import { validate } from 'uuid';
import { ParseMessage, User } from './types';

export function parseURL(url: string | undefined): ParseMessage {
  if (!url) url = '/';
  if (url.slice(-1) != '/') url += '/';
  const members = url.split('/');
  if (members[1] != 'api' || members[2] != 'users')
    return { code: 404, message: 'Requests to non-existing endpoints' };
  if (members.length == 4) return { code: 200, message: '' };
  if (members.length == 5) {
    if (validate(members[3])) return { code: 200, message: members[3] };
    else return { code: 400, message: 'UserId is invalid' };
  }
  return { code: 404, message: 'Requests to non-existing endpoints' };
}

export async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((res, rej) => {
    let body = '';
    req.setEncoding('utf-8');
    req.on('data', (data) => {
      body += data;
    });
    req.on('end', () => res(body));
    req.on('error', (err) => {
      rej(err);
    });
  });
}

export function validateBody(body: User): string {
  const keys = Object.keys(body);
  if (!keys.includes('username'))
    return 'Required username property is missing';
  if (!keys.includes('age')) return 'Required age property is missing';
  if (!keys.includes('hobbies')) return 'Required hobbies property is missing';
  for (let key of keys)
    if (!['username', 'age', 'hobbies'].includes(key))
      return `Request contains an invalid ${key} property`;

  if (typeof body.username != 'string')
    return 'Username property is not a string';
  if (typeof body.age != 'number') return 'Age property is not a number';
  if (!Array.isArray(body.hobbies)) return 'Hobbies property is not an array';
  for (let hobby of body.hobbies)
    if (typeof hobby != 'string')
      return 'Hobbies property contains a non-string element';

  return '';
}
