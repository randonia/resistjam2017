DEFAULT_FONTSIZE = 16;
DEFAULT_FONT = 'Iceland';
class BaseWindow {
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.initialize();
    this.selected = false;
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
  drawText(x, y, message, size = undefined) {
    var bmd = this.bmp;
    bmd.ctx.font = sprintf("%spx %s", (size || DEFAULT_FONTSIZE), DEFAULT_FONT);
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
class FilterWindow extends BaseWindow {
  constructor() {
    super(0, 0, WIN_WIDTH / 4, WIN_HEIGHT - WIN_CMDHEIGHT);
  }
}
// Center Window - for showing the map
NUM_NODES = 5000;
class MapWindow extends BaseWindow {
  constructor() {
    super(WIN_WIDTH / 4, 0, WIN_WIDTH / 2, WIN_HEIGHT - WIN_CMDHEIGHT);
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
}
// Right Window - for showing the log
class LogWindow extends BaseWindow {
  constructor() {
    super(3 * WIN_WIDTH / 4, 0, WIN_WIDTH / 4, WIN_HEIGHT - WIN_CMDHEIGHT);
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
    super(0, WIN_HEIGHT - WIN_CMDHEIGHT, 800, WIN_CMDHEIGHT);
    this.cmd_history = [];
    this.cmd_current = '';
    this.blinker = new Blinker(500, 200);
  }
  // Events
  onDownCallback(key) {
    this.cmd_current += key;
  }
  onBackspace(event) {
    var rmWholeWord = game.input.keyboard.isDown(Phaser.KeyCode.CONTROL);
    var str = this.cmd_current;
    if (rmWholeWord) {
      var lastIndex = str.lastIndexOf(' ');
      str = str.substr(0, lastIndex);
    } else {
      str = str.substr(0, str.length - 1);
    }
    this.cmd_current = str;
  }
  onEnter(event) {
    if (this.cmd_current.length > 0) {
      this.executeCurrentCmd();
    }
  }
  render() {
    super.render();
    var cmdLen = this.cmd_history.length;
    for (var i = cmdLen - 1; i >= 0; i--) {
      this.drawText(CMD_START_X, CMD_HIST_START_Y - CMD_PADDING * (cmdLen - i - 1), sprintf('# %s', this.cmd_history[i]));
    }
    var cmdStr = sprintf('$ %s%s', this.cmd_current, (this.blinker.blink()) ? '_' : '');
    this.drawText(CMD_START_X, CMD_START_Y, cmdStr);
  }
  executeCurrentCmd() {
    var cmd = this.cmd_current;
    this.cmd_history.push(cmd);
    this.cmd_current = '';
  }
}
