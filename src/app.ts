import express from 'express';
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

  app.listen(80, () => {
    console.log('app started');
  });
})();
