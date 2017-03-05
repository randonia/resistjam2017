DEFAULT_FONTSIZE = 16;
DEFAULT_FONT = 'Anonymous Pro, monospace';
class BaseWindow {
  static get TYPE_FILTER() {
    return 'window_filter';
  }
  static get TYPE_MAP() {
    return 'window_map';
  }
  static get TYPE_LOG() {
    return 'window_log';
  }
  static get TYPE_COMMAND() {
    return 'window_command';
  }
  constructor(x, y, width, height, type = undefined) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.initialize();
    this.selected = false;
    this.type = type;
    if (!this.type) {
      throw new TypeError('Undefined Window Type');
    }
  }
  initialize() {
    this.bmp = game.add.bitmapData(this.width, this.height);
    this.sprite = game.add.sprite(this.x, this.y, this.bmp);
  }
  update() {}
  render() {
    var bmd = this.bmp;
    bmd.clear();
    bmd.ctx.lineWidth = '2';
    bmd.ctx.strokeStyle = (this.selected) ? 'green' : '#535f53';
    bmd.ctx.fillStyle = '#111';
    bmd.ctx.fillRect(0, 0, this.width, this.height);
    bmd.ctx.strokeRect(0, 0, this.width, this.height);
  }
  addChild(sprite) {
    this.sprite.addChild(sprite);
  }
  drawText(x, y, message, size = undefined, align = undefined) {
    var bmd = this.bmp;
    bmd.ctx.font = sprintf("%spx %s", (size || DEFAULT_FONTSIZE), DEFAULT_FONT);
    bmd.ctx.textAlign = align || 'start';
    bmd.ctx.fillStyle = 'black';
    bmd.ctx.fillText(message, x + 1, y + 1);
    bmd.ctx.fillStyle = 'green';
    bmd.ctx.fillText(message, x, y);
  }
  fillRect(x, y, width, height, color = 'green') {
    var bmd = this.bmp;
    bmd.ctx.fillStyle = color;
    bmd.ctx.fillRect(x, y, width, height);
  }
  onTabKey(event) {} // Empty event default
  onDownCallback(event) {} // Empty event default
  onBackspace(event) {} // Empty event default
  onEnter(event) {} // Empty event default
}
// Window Consts
WIN_WIDTH = 800;
WIN_HEIGHT = 600;
WIN_CMDHEIGHT = 100;
// Left hand window - for filtering
FIL_LIST_TITLE_Y = 25;
FIL_LIST_HEADER_PADDING = 25;
FIL_LIST_HEADER_Y = FIL_LIST_TITLE_Y + 30;
FIL_LIST_START_X = 5;
FIL_LIST_TO_START_Y = FIL_LIST_HEADER_Y + FIL_LIST_HEADER_PADDING;
FIL_LIST_PADDING_Y = 20;
FIL_LIST_HEADER2_PADDING_Y = 25;
class FilterWindow extends BaseWindow {
  constructor() {
    super(0, 0, WIN_WIDTH / 4, WIN_HEIGHT - WIN_CMDHEIGHT, BaseWindow.TYPE_FILTER);
    this.initFilters();
  }
  initFilters() {
    this.filters = [];
    this.nodeSprites = [];
    var availableFilters = Node.getTypes();
    for (var i = 0; i < availableFilters.length; i++) {
      this.filters.push({
        'set': false,
        'id': i,
        'type': availableFilters[i],
        'direction': 'to'
      });
      this.filters.push({
        'set': false,
        'id': i,
        'type': availableFilters[i],
        'direction': 'from'
      });
    }
    // Initialize the node sprites
    for (var idx = 0; idx < 2; idx++) {
      for (var idxAF = 0; idxAF < availableFilters.length; idxAF++) {
        this.nodeSprites.push(new Node(0, 0, availableFilters[idxAF]));
      }
    }
  }
  setFilter(filterTypes) {
    this.filters = filterTypes;
    this.resetFilter();
  }
  resetFilter() {
    var state = game.state.getCurrentState();
    var mapWindow = state.getWindow(BaseWindow.TYPE_MAP);
    mapWindow.execFilter(this.filters.filter(function(item) {
      return item.set;
    }));
  }
  filterTo(item) {
    return item.direction == 'to';
  }
  filterFrom(item) {
    return item.direction == 'from';
  }
  render() {
    super.render();
    this.drawText(this.width * 0.5, FIL_LIST_TITLE_Y, 'MAP FILTERS', undefined, 'center');
    this.drawText(FIL_LIST_START_X, FIL_LIST_HEADER_Y, 'Filter To');
    var toFilters = this.filters.filter(this.filterTo);
    var toFiltersLastY = 0;
    var spritePaddingX = 54;
    var ctr = 0;
    for (var i = 0; i < toFilters.length; i++) {
      var currFilter = toFilters[i];
      var str = sprintf("%s)[%s]......to %s", ('0000' + ctr++).slice(-2), (currFilter.set ? 'X' : ' '), currFilter.type);
      toFiltersLastY = FIL_LIST_TO_START_Y + i * FIL_LIST_PADDING_Y;
      this.drawText(FIL_LIST_START_X, toFiltersLastY, str);
      this.nodeSprites[i].sprite.x = FIL_LIST_START_X + spritePaddingX;
      this.nodeSprites[i].sprite.y = FIL_LIST_TO_START_Y + i * FIL_LIST_PADDING_Y - 13;
    }
    toFiltersLastY += FIL_LIST_PADDING_Y + FIL_LIST_HEADER2_PADDING_Y;
    var fromFilters = this.filters.filter(this.filterFrom);
    this.drawText(FIL_LIST_START_X, toFiltersLastY, 'Filter From');
    toFiltersLastY += FIL_LIST_HEADER2_PADDING_Y;
    for (var i = 0; i < fromFilters.length; i++) {
      var currFilter = fromFilters[i];
      var str = sprintf("%s)[%s]....from %s", ('0000' + ctr++).slice(-2), (currFilter.set ? 'X' : ' '), currFilter.type);
      this.drawText(FIL_LIST_START_X, toFiltersLastY + i * FIL_LIST_PADDING_Y, str);
      this.nodeSprites[toFilters.length + i].sprite.x = FIL_LIST_START_X + spritePaddingX;
      this.nodeSprites[toFilters.length + i].sprite.y = toFiltersLastY + i * FIL_LIST_PADDING_Y - 13;
    }
  }
}
// Center Window - for showing the map
NUM_NODES = 5000;
class MapWindow extends BaseWindow {
  constructor() {
    super(WIN_WIDTH / 4, 0, WIN_WIDTH / 2, WIN_HEIGHT - WIN_CMDHEIGHT, BaseWindow.TYPE_MAP);
    this.gameObjects = [];
    this.generateNodes('seed'); // Let's pretend I use the seed
  }
  generateNodes(seed) {
    // Do something with a seed I guess?
    var state = game.state.getCurrentState();
    var available_types = [
    Node.TYPE_A,
    Node.TYPE_B,
    Node.TYPE_C,
    Node.TYPE_D,
    Node.TYPE_E,
    ];
    var numNodes = (seed['numNodes'] || NUM_NODES);
    for (var i = 0; i < numNodes; i++) {
      var node = new Node(Utils.randomInRange(0, this.width - 16), Utils.randomInRange(0, this.height - 16), available_types[Utils.randomInRange(0, available_types.length)]);
      this.addChild(node.sprite);
      state.gameObjects.push(node);
    }
  }
  execFilter(filters) {
    console.log(filters);
  }
}
// Right Window - for showing the log
class LogWindow extends BaseWindow {
  constructor() {
    super(3 * WIN_WIDTH / 4, 0, WIN_WIDTH / 4, WIN_HEIGHT - WIN_CMDHEIGHT, BaseWindow.TYPE_LOG);
    this.logs = [];
    this.lastAdd = Date.now();
  }
  render() {
    super.render();
    for (var i = this.logs.length - 1; i >= 0; i--) {
      this.drawText(5, 15 + i * 12, this.logs[i], 12);
    }
  }
}
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
      this.drawText(CMD_START_X, CMD_HIST_START_Y - CMD_PADDING * (cmdLen - i - 1), this.cmdMessages[i], 12);
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
        console.log("Need to make filtering");
        break;
      case Command.TYPE_HELP:
        this.execCmdHelp(command);
        break;
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
}
