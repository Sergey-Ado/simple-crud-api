import { IncomingMessage, request, RequestOptions, ServerResponse } from 'http';

let i = 0;

export function redirectHandler(
  portInput: number | null,
  port: number,
  portOut: number | number[],
  reqInput: IncomingMessage,
  resOut: ServerResponse
) {
  const options: RequestOptions = {
    port: portInput,
    path: reqInput.url,
    method: reqInput.method,
    hostname: 'localhost',
  };

  if (Array.isArray(portOut)) {
    options.port = portOut[i];
    i++;
    i %= portOut.length;
  } else options.port = portOut;

  const reqOut = request(options, (resInput) => {
    resOut.statusCode = resInput.statusCode || 200;
    for (let header in resInput.headers)
      if (resInput.headers[header])
        resOut.setHeader(header, resInput.headers[header]);
    resInput.pipe(resOut);

    resInput.on('end', () => {
      if (typeof portOut == 'number') {
        console.log(
          `Worker on port ${port} received a response from the database on port ${options.port} and sent it to the server on port ${portInput}`
        );
      } else {
        console.log(
          `Server on port ${port} received a response from the worker on port ${options.port} and sent it to the client`
        );
      }
    });
  });

  for (let header in reqInput.headers)
    if (reqInput.headers[header] && header != 'host')
      reqOut.setHeader(header, reqInput.headers[header]!);

  reqInput.on('end', () => {
    if (typeof portOut == 'number') {
      console.log(
        `Worker on port ${port} received a request from a server on port ${portInput} and sent it to the database on port ${options.port}`
      );
    } else {
      console.log(
        `Server on port ${port} received a request from a client and sent it to the worker on port ${options.port}`
      );
    }
  });

  reqInput.pipe(reqOut).on('error', () => {
    resOut.statusCode = 500;
    resOut.setHeader('content-type', 'application/json');
    resOut.write(JSON.stringify('Errors on the server side'));
    resOut.end();
  });
}
