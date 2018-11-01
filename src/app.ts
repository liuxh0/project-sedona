import express, { Express } from 'express';
import { Server } from 'http';
import * as availability from './api/availability';
import { DatabaseUtils } from './database-utils';

export class App {
  private readonly port = 80;
  private readonly pathPrefix = '/api/sedona/v1';

  private app: Express;
  private server: Server | undefined;

  constructor() {
    this.app = express();
    this.app.get(`${this.pathPrefix}/availability`, availability.get);
  }

  async start(): Promise<void> {
    const databaseReady = await DatabaseUtils.tryConnection();
    if (databaseReady === false) {
      // TODO: use logger
      console.warn('WARNING: Connection to database fails.');
    }

    return new Promise<void>(resolve => {
      this.server = this.app.listen(this.port, () => resolve());
    });
  }

  stop(): Promise<void> {
    return new Promise(resolve => {
      if (this.server) {
        this.server.close(() => resolve());
      }
    });
  }
}
