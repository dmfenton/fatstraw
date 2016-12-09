require('yargs')
  .usage('fatstraw <cmd> [options]')
  .commandDir('./commands')
  .help('help')
  .epilog('Made with ♥️  by Esri DC R&D')
  .argv
