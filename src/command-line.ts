import * as readline from 'readline';
import { Logger } from './logger';

export class CommandLine {
  private readonly prompt = '>> ';

  private rl: readline.ReadLine;
  private commands: Map<string, CommandCallback>;

  constructor(private logger: Logger) {
    this.commands = new Map();
    this.registerBuildinCommands();

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: this.prompt
    });

    this.rl.on('SIGINT', () => {
      // Do nothing
    }).on('line', async input => {
      this.logger.console(this.prompt + input);

      if (this.commands.has(input)) {
        this.rl.pause();

        const callback = this.commands.get(input)!;
        const callbackReturn = callback(message => this.output(message));
        await Promise.resolve(callbackReturn);
      } else {
        this.output('Unknown command');
      }

      this.output();  // Print an empty line to separate commands
      this.rl.prompt();
    });

    // Take over control at start
    this.rl.pause();
  }

  /**
   * Starts receiving user input.
   */
  start(): void {
    this.rl.prompt();
  }

  /**
   * Stops receiving user input.
   */
  pause(): void {
    this.rl.pause();
  }

  output(message?: string): void {
    if (message) {
      console.log(message);
      this.logger.console(message);
    } else {
      console.log();
    }
  }

  registerCommand(command: string, callback: CommandCallback): void {
    if (command.length === 0) {
      throw new Error('Cannot register empty command');
    }

    if (this.commands.has(command)) {
      throw new Error('Command already registered');
    }

    this.commands.set(command, callback);
  }

  private registerBuildinCommands(): void {
    this.registerCommand('commands', output => {
      output('Available commands:');
      Array.from(this.commands.keys())
        .filter(cmd => cmd !== 'commands')
        .forEach(cmd => {
          output(`- ${cmd}`);
        });
    });
  }
}

interface CommandCallback {
  (output: Output): void | Promise<void>
}

interface Output {
  (message: string): void
}
