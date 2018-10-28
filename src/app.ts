import express from 'express';
import * as readline from 'readline';
import * as availability from './api/availability';
import { DatabaseUtils } from './database-utils';

const pathPrefix = '/api/sedona/v1';

const app = express();
app.get(`${pathPrefix}/availability`, availability.get);

(async () => {
  const databaseReady = await DatabaseUtils.tryConnection();
  if (databaseReady === false) {
    console.warn('WARNING: Connection to database fails.')
  }

  const server = app.listen(80, () => {
    console.log('server started');

    process.on('SIGINT', (signal) => {
      // Clear ^C output
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);

      console.log('closing server');
      server.close(() => {
        process.exit();
      });
    });
  });
})();
