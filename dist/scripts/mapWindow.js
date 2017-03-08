// Center Window - for showing the map
NUM_NODES = 500;
NUM_PEOPLE = 50;
NUM_SUSPECTS = 15;
NODE_SIZE = 16;
SCAN_DURATION = 4000;
roundTarget = undefined;
suspects = [];
class MapWindow extends BaseWindow {
  constructor() {
    super(WIN_WIDTH / 4, 0, WIN_WIDTH / 2, WIN_HEIGHT - WIN_CMDHEIGHT, BaseWindow.TYPE_MAP);
    gameObjects = [];
    this.generatePeople({});
    this.setupRound();
    this.callCooldown = 500;
    this.lastCallMade = Number.MIN_VALUE;
    this.scannedTargets = {};
  }
  generatePeople(seed) {
    for (var i = 0; i < (seed['numPeople'] || NUM_PEOPLE); i++) {
      var person = new Person(Utils.randomInRange(0, this.width - NODE_SIZE), Utils.randomInRange(0, this.height - NODE_SIZE));
      gameObjects.push(person);
      this.addChild(person.sprite);
    }
  }
  setupRound() {
    this.targetIndex = Utils.randomInRange(0, gameObjects.length);
    roundTarget = gameObjects[this.targetIndex];
    var suspectIdxs = {}
    do {
      var newIdx = Utils.randomInRange(0, gameObjects.length);
      if (newIdx == this.targetIndex || suspectIdxs[newIdx]) {
        continue;
      }
      var newSuspect = gameObjects[newIdx];
      suspectIdxs[newIdx] = newSuspect;
      suspects.push(newSuspect);
    } while (suspects.length < NUM_SUSPECTS)
  }
  scanTarget(targetObj) {
    // See if we're already scanning
    if (this.scannedTargets[targetObj.name]) {
      return;
    }
    logWindow.msg(sprintf('Beginning scan of %s', targetObj.name));
    this.scannedTargets[targetObj.name] = {
      'startTime': Date.now()
    }
  }
  execFilter(filters) {
    for (var i = 0; i < filters.length; i++) {
      var person = gameObjects[i];
      person.setTracked(filters[i].tracked);
    }
  }
  update() {
    super.update();
    this.processScannedUnits();
    this.makeCall();
  }
  processScannedUnits() {
    for (var scanId in this.scannedTargets) {
      var targetData = this.scannedTargets[scanId];
      // Finish if we're done scanning
      if (targetData.startTime + SCAN_DURATION < Date.now()) {
        // Process the results
        var success = false;
        for (var i = 0; i < suspects.length; i++) {
          var suspect = suspects[i];
          if (suspect.name === scanId) {
            success = true;
            break;
          }
        }
        if (success) {
          logWindow.msg(sprintf('SUSPECT FOUND %s', scanId), LogWindow.MODE_WARN);
          var suspect = filterWindow.setFilterStatusByGameObjectId(scanId);
        } else {
          logWindow.msg(sprintf('No records found %s', scanId));
        }
        // Remove them from the list
        delete this.scannedTargets[scanId];
      }
      // Otherwise keep going
    }
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
