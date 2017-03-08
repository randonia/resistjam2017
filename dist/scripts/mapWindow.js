// Center Window - for showing the map
NUM_NODES = 500;
NUM_PEOPLE = 50;
NODE_SIZE = 16;
class MapWindow extends BaseWindow {
  constructor() {
    super(WIN_WIDTH / 4, 0, WIN_WIDTH / 2, WIN_HEIGHT - WIN_CMDHEIGHT, BaseWindow.TYPE_MAP);
    gameObjects = [];
    // this.generateNodes(); // Let's pretend I use the seed
    this.generatePeople({});
    this.callCooldown = 500;
    this.lastCallMade = Number.MIN_VALUE;
  }
  generatePeople(seed) {
    for (var i = 0; i < (seed['numPeople'] || NUM_PEOPLE); i++) {
      var person = new Person(Utils.randomInRange(0, this.width - NODE_SIZE), Utils.randomInRange(0, this.height - NODE_SIZE));
      gameObjects.push(person);
      this.addChild(person.sprite);
    }
  }
  generateNodes() {
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
      var node = new Node(Utils.randomInRange(0, this.width - NODE_SIZE), Utils.randomInRange(0, this.height - NODE_SIZE), available_types[Utils.randomInRange(0, available_types.length)]);
      this.addChild(node.sprite);
      gameObjects.push(node);
      state.gameObjects.push(node);
    }
  }
  execFilter(filters) {
    var lookups = {};
    for (var i = 0; i < filters.length; i++) {
      var type = filters[i].type;
      var isSet = filters[i].set;
      lookups[type] = isSet;
    }
    for (var i = 0; i < gameObjects.length; i++) {
      var node = gameObjects[i];
      node.setVisible(lookups[node.type]);
    }
  }
  update() {
    super.update();
    for (var i = 0; i < gameObjects.length; i++) {
      gameObjects[i].update();
    }
    this.makeCall();
  }
  makeCall() {
    // if (this.canMakeCall()) {}
  }
  canMakeCall() {
    var now = Date.now();
    if (this.lastCallMade + this.callCooldown < now) {
      var srcIdx = Utils.randomInRange(0, gameObjects.length);
      var dstIdx = Utils.randomInRange(0, gameObjects.length);
      // Make sure you don't add yourself
      if (srcIdx === dstIdx) {
        return false;
      }
      gameObjects[srcIdx].addToPath(gameObjects[dstIdx]);
      this.lastCallMade = now;
      this.callCooldown = 200 + Utils.randomInRange(100, 1500);
    }
  }
  render() {
    super.render();
    var halfSize = 8;
    var bmd = this.bmp;
    for (var gIdx = 0; gIdx < gameObjects.length; gIdx++) {
      var node = gameObjects[gIdx];
      if (!node.visible) {
        continue;
      }
      var path = node.path;
      // Get the starting position (p1)
      var lastX = node.x + halfSize;
      var lastY = node.y + halfSize;
      // Move to the starting position
      bmd.ctx.beginPath();
      bmd.ctx.moveTo(lastX, lastY);
      for (var pIdx = 0; pIdx < path.length; pIdx++) {
        var target = path[pIdx];
        bmd.ctx.moveTo(lastX, lastY);
        // Get the target's positions (p2)
        var newX = target.x + halfSize;
        var newY = target.y + halfSize;
        // fake vector math here (p2 - p1)
        var tailX = newX - lastX;
        var tailY = newY - lastY;
        // (shortX, shortY) is a point short of the target, for multi-color lining
        var shortPointX = tailX * 0.125;
        var shortPointY = tailY * 0.125;
        var shortX = newX - shortPointX;
        var shortY = newY - shortPointY;
        bmd.ctx.lineWidth = '1';
        bmd.ctx.strokeStyle = 'green';
        bmd.ctx.lineTo(shortX, shortY);
        bmd.ctx.stroke();
        bmd.ctx.closePath();
        bmd.ctx.beginPath();
        bmd.ctx.lineWidth = '3';
        bmd.ctx.strokeStyle = 'yellow';
        bmd.ctx.moveTo(shortX, shortY);
        bmd.ctx.lineTo(newX, newY);
        bmd.ctx.stroke();
        lastX = newX;
        lastY = newY;
      }
      bmd.ctx.closePath();
    }
    for (var i = 0; i < gameObjects.length; i++) {
      gameObjects[i].render(bmd.ctx);
    }
  }
}
