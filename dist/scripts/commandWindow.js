// Command window variables
CMD_START_X = 5;
CMD_START_Y = WIN_CMDHEIGHT - 5;
CMD_PADDING = 14;
CMD_HIST_START_Y = CMD_START_Y - CMD_PADDING;
class CommandWindow extends BaseWindow {
  constructor() {
    super(0, WIN_HEIGHT - WIN_CMDHEIGHT, 800, WIN_CMDHEIGHT, BaseWindow.TYPE_COMMAND);
    this.cmdHistory = [];
    this.cmdMessages = [];
    this.cmdCurrentStr = '';
    this.blinker = new Blinker(500, 200);
  }
  // Events
  onDownCallback(key) {
    this.cmdCurrentStr += key;
  }
  onBackspace(event) {
    var rmWholeWord = game.input.keyboard.isDown(Phaser.KeyCode.CONTROL);
    var str = this.cmdCurrentStr;
    if (rmWholeWord) {
      var lastIndex = str.lastIndexOf(' ');
      str = str.substr(0, lastIndex);
    } else {
      str = str.substr(0, str.length - 1);
    }
    this.cmdCurrentStr = str;
  }
  onEnter(event) {
    if (this.cmdCurrentStr.length > 0) {
      this.executeCurrentCmd();
    }
  }
  render() {
    super.render();
    var cmdLen = this.cmdMessages.length;
    for (var i = cmdLen - 1; i >= 0; i--) {
      this.drawText(CMD_START_X, CMD_HIST_START_Y - CMD_PADDING * (cmdLen - i - 1), this.cmdMessages[i]);
    }
    var cmdStr = sprintf('$ %s%s', this.cmdCurrentStr, (this.blinker.blink()) ? '_' : '');
    this.drawText(CMD_START_X, CMD_START_Y, cmdStr);
  }
  pushMessage(msg, cmd = false) {
    this.cmdMessages.push(sprintf('%s %s', (cmd ? '$' : '#'), msg));
  }
  executeCurrentCmd() {
    var cmdStr = this.cmdCurrentStr;
    this.cmdHistory.push(cmdStr);
    this.pushMessage(cmdStr, true);
    this.cmdCurrentStr = '';
    var command = new Command(cmdStr);
    switch (command.type) {
      case Command.TYPE_FILTER:
        this.execCmdFilter(command);
        break;
      case Command.TYPE_HELP:
        this.execCmdHelp(command);
        break;
      case Command.TYPE_SCAN:
        this.execCmdScan(command);
        break;
      case Command.TYPE_ARREST:
        this.execCmdArrest(command);
        break;
    }
  }
  execCmdArrest(command) {
    var targetId = command.getArg(0);
    if (!targetId || isNaN(targetId)) {
      this.pushMessage('Invalid arrest usage. See help by typing:');
      this.pushMessage('help arrest');
    } else {
      var target = filterWindow.getGameObjectByFilterId(targetId);
      if (!target) {
        this.pushMessage(sprintf('Invalid arrest ID - ID [%s] not found', targetId));
        return;
      }
      mapWindow.dispatchPolice(target);
    }
  }
  execCmdScan(command) {
    var targetId = command.getArg(0);
    if (!targetId || isNaN(targetId)) {
      this.pushMessage('Invalid scan usage. See help by typing:');
      this.pushMessage('help scan');
    } else {
      var target = filterWindow.getGameObjectByFilterId(targetId);
      if (!target) {
        this.pushMessage(sprintf('Invalid scan ID - ID [%s] not found', targetId));
        return;
      }
      mapWindow.scanTarget(target);
    }
  }
  execCmdHelp(command) {
    var helpStrings = [];
    var allCommands = Command.COMMAND_LIST;
    var helpArg = command.getArg(0);
    // Get a specific command's help
    if (helpArg) {
      // Pick the right command
      var helpCommand = undefined;
      for (var i = 0; i < allCommands.length; i++) {
        if (allCommands[i].commands.indexOf(helpArg) !== -1) {
          helpCommand = allCommands[i];
          break;
        }
      }
      if (helpCommand) {
        // Print out all the help strings
        helpStrings.push(helpCommand.commands.map(function(cmdStr) {
          return sprintf('[%s]', cmdStr);
        }));
        for (var i = 0; i < helpCommand.helpStrings.length; i++) {
          helpStrings.push(sprintf('  %s', helpCommand.helpStrings[i]));
        }
      } else {
        helpStrings.push(sprintf('[help]: Unknown command `%s`', helpArg));
      }
    } else {
      // Otherwise get all the commands listed
      for (var cIdx = 0; cIdx < allCommands.length; cIdx++) {
        var cmdHelpStr = sprintf("%s", allCommands[cIdx].commands.map(function(cmdStr) {
          return sprintf("[%s]", cmdStr);
        }));
        helpStrings.push(sprintf('%s - %s', allCommands[cIdx].name, cmdHelpStr));
        if (allCommands[cIdx].type == Command.TYPE_HELP) {
          for (var hIdx = 0; hIdx < allCommands[cIdx].helpStrings.length; hIdx++) {
            helpStrings.push(sprintf('  %s', allCommands[cIdx].helpStrings[hIdx]));
          }
        }
      }
    }
    for (var hsIdx = 0; hsIdx < helpStrings.length; hsIdx++) {
      this.pushMessage(helpStrings[hsIdx]);
    }
  }
  execCmdFilter(command) {
    filterWindow.processFilterCmd(command);
  }
}
