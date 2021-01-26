import yargs from 'yargs';
import { commands } from './commands/commands';

const run = () => {
    for (const command of commands) {
        yargs.command(command.command, command.description, command.builder, command.handler);
    }
    yargs.help('help');
    yargs.version();
    yargs.argv;
}

run();
