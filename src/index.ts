import { createServer } from 'node:http';
import { databaseHandler } from './modules/databaseHandler.js';
import 'dotenv/config';

const app = createServer(databaseHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}...`));
