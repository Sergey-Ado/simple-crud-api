import { IncomingMessage, ServerResponse } from 'http';
import { parseURL, readBody } from './utils.js';
import { controller } from './controller.js';

export async function databaseHandler(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    const parse = parseURL(req.url);
    if (parse.code == 400 || parse.code == 404) {
      res.statusCode = parse.code;
      res.write(parse.message);
      res.end();
    } else {
      const body = await readBody(req);
      const response = controller(req.method, parse.message, body);
      res.setHeader('content-type', 'application/json');
      res.statusCode = response.code;
      res.write(response.message);
      res.end();
    }
  } catch (e) {
    res.statusCode = 500;
    res.write('Errors on the server side');
    res.end();
  }
}
