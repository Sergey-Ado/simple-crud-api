import { IncomingMessage } from 'http';
import { validate } from 'uuid';
import { Res, User } from './types';

export function parseURL(url: string | undefined): Res {
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
    req.on('error', () => rej(new Error()));
  });
}

export function validateBody(body: Omit<User, 'id'>): string {
  if (typeof body.username != 'string' || body.username == '')
    return 'Invalid username';
  if (typeof body.age != 'number' || body.age <= 0) return 'Invalid age';
  if (!Array.isArray(body.hobbies)) return 'Invalid hobbies';
  body.hobbies.forEach((hobby) => {
    if (typeof hobby != 'string' || hobby == '') return false;
  });
  return '';
}
