class Command {
  static get TYPE_FILTER() {
    return 'cmd_filter';
  }
  static get TYPE_HELP() {
    return 'cmd_help';
  }
  static get TYPE_SCAN() {
    return 'cmd_scan';
  }
  static get TYPE_ARREST() {
    return 'cmd_arrest';
  }
  static get TYPE_IGNORE() {
    return 'cmd_ignore';
  }
  static get COMMAND_LIST() {
    return [
      {
        'type': Command.TYPE_HELP,
        'name': 'Help',
        'commands': ['help', '?', 'h'],
        'helpStrings': ['Type `help COMMAND` to see help on that command']
      },
      {
        'type': Command.TYPE_FILTER,
        'name': 'Track',
        'commands': ['track', 't'],
        'helpStrings': ['Use to toggle tracking on a subject', 'Usage: track ID', 'Example: track 12.345']
      },
      {
        'type': Command.TYPE_SCAN,
        'name': 'Scan',
        'commands': ['scan', 's'],
        'helpStrings': ['Use to scan to see history and determines suspicion. Once you scan a person, the', 'system will detect if they are worth further investigation.', 'Usage: scan ID']
      },
      {
        'type': Command.TYPE_ARREST,
        'name': 'Arrest',
        'commands': ['arrest', 'a'],
        'helpStrings': ['Use to dispatch a police unit to capture the target.', '***** USE EXTREME CAUTION *****', 'Usage: arrest ID']
      },
      {
        'type': Command.TYPE_IGNORE,
        'name': 'Ignore',
        'commands': ['ignore', 'i'],
        'helpStrings': ['Use to ignore a subject. This will remove their name and any connections to them from the map.', 'Usage: ignore ID', 'Example: ignore 12.432']
      },

    ]
  }
  static getTypeFromCommand(command) {
    var availableCommands = Command.COMMAND_LIST;
    var selected = undefined;
    for (var i = 0; i < availableCommands.length; i++) {
      if (availableCommands[i].commands.indexOf(command) !== -1) {
        return availableCommands[i].type;
      }
    }
    return undefined;
  }
  constructor(message) {
    this.parseMessage(message);
    if (!this.type) {
      throw new TypeError(sprintf("PASSED INVALID COMMAND %s", message));
    }
  }
  parseMessage(message) {
    console.log("PARSING: " + message);
    var params = message.split(' ');
    this.type = Command.getTypeFromCommand(params[0]);
    this.argv = params.slice(1);
  };
  getArg(idx) {
    return this.argv[idx];
  }
}
