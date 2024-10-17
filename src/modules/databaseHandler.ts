import { IncomingMessage, ServerResponse } from 'http';
import { parseURL, readBody } from './utils.js';
import { controller } from './controller.js';

export async function databaseHandler(
  req: IncomingMessage,
  res: ServerResponse
) {
  const parse = parseURL(req.url);
  if (parse.code == 400 || parse.code == 404) {
    res.statusCode = parse.code;
    res.setHeader('content-text', 'application/json');
    res.write(JSON.stringify(parse.message));
    res.end();
  } else {
    const body = await readBody(req);
    const response = controller(req.method, parse.message, body);
    res.setHeader('content-type', 'application/json');
    res.statusCode = response.code;
    res.write(JSON.stringify(response.message));
    res.end();
  }
}
