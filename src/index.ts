import { App } from "./app";
import { CommandLine } from "./command-line";
import { Logger } from "./logger";

const logger = new Logger();
const commandLine = new CommandLine(logger);
commandLine.output('Bootstrapping...');
commandLine.output();

const app = new App();
app.start().then(() => {
  logger.info('Server successfully started');

  registerCommands();
  commandLine.start();
}, reason => {
  commandLine.output(`Cannot start server: ${reason}`);
  exit();
});

function registerCommands(): void {
  commandLine.registerCommand('shutdown', async output => {
    output('Shutting down server');
    await app.stop();
    output('Server successfully shut down');
    await exit();
  });
}

async function exit(): Promise<void> {
  await logger.destruct();
  process.exit();
}
