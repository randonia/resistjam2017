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
        'name': 'Filter',
        'commands': ['track', 't'],
        'helpStrings': ['Use to toggle tracking.', 'Usage: $ track ID', 'ID - The numeric ID on the left side of the track menu', 'Usage: $ track a - Re-enables every subject', 'Usage: $ track n - disables every subject']
      },
      {
        'type': Command.TYPE_SCAN,
        'name': 'Scan',
        'commands': ['scan', 's'],
        'helpStrings': ['Use to scan to see history and determine suspicion.', 'Usage: $ scan ID', 'ID - The numeric ID on the left side of the track menu']
      }
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
