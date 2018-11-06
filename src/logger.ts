import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export class Logger {
  private ws: fs.WriteStream;

  constructor() {
    const folder = path.join(os.homedir(), 'logs');
    const filename = `${new Date().toISOString()}-log`;
    const filepath = path.join(folder, filename);

    this.ws = fs.createWriteStream(filepath, {
      flags: 'wx'
    });
  }

  console(message: string): void {
    this.log(LogLevel.CONSOLE, message);
  }

  info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  warning(message: string): void {
    this.log(LogLevel.WARNING, message);
  }

  error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }

  async destruct(): Promise<void> {
    return new Promise<void>(resolve => {
      this.ws.end(() => resolve());
    });
  }

  log(level: LogLevel, message: string): void {
    const time = (new Date()).toISOString();
    const logLevel = this.getLogLevelString(level);

    const line = `[${time}][${logLevel}] ${message}\n`;
    this.ws.write(line);
  }

  private getLogLevelString(logLevel: LogLevel): string {
    switch (logLevel) {
      case LogLevel.CONSOLE:  return 'CNSL';
      case LogLevel.INFO:     return 'INFO';
      case LogLevel.WARNING:  return 'WARN';
      case LogLevel.ERROR:    return 'ERR ';
    }
  }
}

enum LogLevel {
  CONSOLE,
  INFO,
  WARNING,
  ERROR
}
