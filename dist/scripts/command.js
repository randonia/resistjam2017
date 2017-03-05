class Command {
  static get TYPE_FILTER() {
    return 'cmd_filter';
  }
  static get TYPE_HELP() {
    return 'cmd_help';
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
        'commands': ['filter', 'f'],
        'helpStrings': ['Use to toggle filters.', 'Usage: $ filter ID', 'ID - The numerical ID on the left side of the filter menu', 'Usage: $ filter a - Re-enables every subject', 'Usage: $ filter n - disables every subject']
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
