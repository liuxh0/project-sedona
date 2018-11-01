import { App } from "./app";
import { CommandLine } from "./command-line";

const commandLine = new CommandLine();
commandLine.pause();

const app = new App();
app.start().then(() => {
  console.log('Server started\n');
  registerCommands();
  commandLine.start();
});

function registerCommands(): void {
  commandLine.registerCommand('shutdown', async output => {
    output('Shutting down server');
    await app.stop();
    process.exit();
  });
}
