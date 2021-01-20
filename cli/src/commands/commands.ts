
// const commands = [{
//     command: 'init [yes]',
//     description: 'Initialize a new Subsembly starter project',
//     builder: (yargs) => {
//         yargs.positional('yes', {
//             describe: 'Initialize with default configuration.',
//             type: 'boolean'
//         })
//     },
//     handler: (argv) => {
//         let { yes } = argv;
//         try {
//             process.on('SIGINT', () => {
//                 console.log('Quitting...');
//                 process.exit(1);
//             });
//             const answers = await Init.askQuestions();
//         }
//     }
// }];