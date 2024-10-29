import { IncomingMessage, ServerResponse } from 'http';
import { parseURL, readBody } from './utils.js';
import { controller } from './controller.js';

export async function databaseHandler(
  req: IncomingMessage,
  res: ServerResponse
) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const parse = parseURL(req.url, req.method);
    if (parse.code == 400 || parse.code == 404) {
      res.statusCode = parse.code;
      res.write(JSON.stringify({ message: parse.message }));
      res.end();
    } else {
      const body = await readBody(req);
      const response = controller(req.method, parse.message, body);
      res.statusCode = response.code;
      res.write(JSON.stringify(response.message));
      res.end();
    }
  } catch (e) {
    res.statusCode = 500;
    res.write(JSON.stringify({ message: 'Errors on the server side' }));
    res.end();
  }
}
