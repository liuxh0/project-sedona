import * as readline from 'readline';

export class CommandLine {
  private rl: readline.ReadLine;
  private commands: Map<string, CommandCallback>;

  constructor() {
    this.commands = new Map();
    this.registerBuildinCommands();

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '>> '
    });

    this.rl.on('SIGINT', () => {
      // Do nothing
    }).on('line', input => {
      if (this.commands.has(input)) {
        this.rl.pause();
        const callback = this.commands.get(input)!;
        const callbackReturn = callback(message => console.log(message));
        Promise.resolve(callbackReturn).then(() => {
          console.log();
          this.rl.prompt();
        });
      } else {
        console.log('Unknown command\n');
        this.rl.prompt();
      }
    });
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
