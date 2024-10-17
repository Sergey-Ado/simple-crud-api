import { IncomingMessage, ServerResponse } from 'http';
import { parseURL, readBody } from './utils.js';

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
  }

  const body = await readBody(req);

  res.end(body);
}
