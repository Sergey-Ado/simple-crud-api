import { createServer } from 'node:http';
import { databaseHandler } from './modules/databaseHandler.js';
import { redirectHandler } from './modules/redirectHandler.js';
import 'dotenv/config';
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';

if (cluster.isPrimary) {
  const countCores = availableParallelism();

  const multiStart = process.argv.includes('--multi');

  const port = +(process.env.PORT || 3000);
  const workerPorts: number[] = [];
  const databasePort = port + countCores;

  if (!multiStart || countCores == 1) {
    const app = createServer(databaseHandler);
    app.listen(port, () => {
      console.log(`Server started on port ${port}...`);
    });
  } else {
    const app = createServer(
      redirectHandler.bind(null, null, port, workerPorts)
    );
    app.listen(port, () => {
      console.log(`Server started on port ${port}...`);
    });
    const database = createServer(databaseHandler);
    database.listen(databasePort, () =>
      console.log(`Database started on port ${databasePort}...`)
    );

    for (let i = 1; i < countCores; i++) {
      const newPort = port + i;
      workerPorts.push(newPort);
      cluster.fork({
        SERVER_PORT: port,
        PORT: newPort,
        DATABASE_PORT: databasePort,
      });
    }
  }
} else {
  const serverPort = +process.env.SERVER_PORT!;
  const port = +process.env.PORT!;
  const databasePort = +process.env.DATABASE_PORT!;

  const workerServer = createServer(
    redirectHandler.bind(this, serverPort, port, databasePort)
  );
  workerServer.listen(port, () =>
    console.log(`Worker started on port ${port}...`)
  );
}
