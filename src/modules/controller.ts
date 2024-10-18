import { get, getAll, post, put, remove } from './service.js';
import { ResponseMessage } from './types';

export function controller(
  method: string | undefined,
  id: string,
  body: string
): ResponseMessage {
  switch (method) {
    case 'GET':
      if (id) return get(id);
      else return getAll();
    case 'POST':
      return post(id, body);
    case 'PUT':
      return put(id, body);
    case 'DELETE':
      return remove(id);
    default:
      return { code: 404, message: 'Invalid method' };
  }
}
