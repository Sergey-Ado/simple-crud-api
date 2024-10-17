import { IncomingMessage } from 'http';
import { validate } from 'uuid';
import { Res } from './types';

export function parseURL(url: string | undefined): Res {
  if (!url) url = '/';
  if (url.slice(-1) != '/') url += '/';
  console.log(url);
  const members = url.split('/');
  console.log(members);
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
    req.on('data', (data) => (body += data));
    req.on('end', () => res(body));
    req.on('error', () => rej(new Error()));
  });
}
