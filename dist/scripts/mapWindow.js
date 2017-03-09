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
    super(WINDOW_FILTER_WIDTH, 0, WINDOW_MAP_WIDTH, WIN_HEIGHT - WIN_CMDHEIGHT, BaseWindow.TYPE_MAP);
    gameObjects = [];
    this.generatePeople({});
    this.setupRound();
    this.callCooldown = 500;
    this.lastCallMade = Number.MIN_VALUE;
    this.scannedTargets = {};
    this.blockList = {};
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
    logWindow.msg(sprintf('** Scanning %s [%s] **', targetObj.name, targetObj.id), undefined, LogWindow.MODE_BOLD);
    this.scannedTargets[targetObj.id] = {
      'startTime': Date.now(),
      'object': targetObj,
      'id': targetObj.id,
      'name': targetObj.name
    }
  }
  execFilter(filters) {
    for (var i = 0; i < filters.length; i++) {
      var person = filters[i].object;
      person.setTracked(filters[i].tracked);
    }
  }
  update() {
    super.update();
    this.processScannedUnits();
    this.makeCall();
  }
  dispatchPolice(target) {
    if (target.id == roundTarget.id) {
      console.log("WIN");
    } else {
      console.log("Not win");
    }
  }
  processScannedUnits() {
    for (var scanId in this.scannedTargets) {
      var targetData = this.scannedTargets[scanId];
      // Finish if we're done scanning
      if (targetData.startTime + SCAN_DURATION < Date.now()) {
        // Process the results
        var isTarget = roundTarget.id == targetData.id;
        var isSuspect = this.isSuspect(targetData.id);
        if (isSuspect || isTarget) {
          logWindow.msg(sprintf('+== Suspicious  Activity ==+'), targetData.id, LogWindow.MODE_WARN);
          logWindow.msg(sprintf('+==      %s %s      ==+', targetData.name, targetData.id), targetData.id, LogWindow.MODE_WARN);
          var suspect = targetData.object;
          suspect.setHistory(this.createHistory(suspect));
          for (var i = 0; i < suspect.path.history.length; i++) {
            var caller = suspect.path.history[i];
            logWindow.msg(sprintf('%s >:>>callto>:>> %s', suspect.id, caller.id), targetData.id, LogWindow.MODE_WARN);
          }
        } else {
          logWindow.msg(sprintf('= No info for %s [%s]=', targetData.name, targetData.id), undefined, LogWindow.MODE_BOLD);
          this.blockList[targetData.id] = Date.now();
        }
        // Remove them from the list
        delete this.scannedTargets[scanId];
      }
      // Otherwise keep going
    }
  }
  createHistory(person) {
    // Early out if this person already has a history
    if (person.path.history.length > 0) {
      return person.path.history;
    }
    // Creates a history based on being a suspect
    var isSuspect = this.isSuspect(person.id);
    var history = [];
    var historyIds = {};
    if (isSuspect) {
      history.push(roundTarget);
      historyIds[roundTarget.id] = 1;
    }
    var numToMake = Utils.randomInRange(10, 15);
    for (var ct = 0; ct < numToMake; ++ct) {
      do {
        var randIdx = Utils.randomInRange(0, gameObjects.length);
        var selectedCaller = gameObjects[randIdx];
        if (!historyIds[randIdx] && selectedCaller.id != roundTarget.id && selectedCaller.id != person.id) {
          historyIds[randIdx] = 1;
          history.push(selectedCaller);
        }
      } while (!historyIds[randIdx])
    }
    return history;
  }
  makeCall() {
    if (this.canMakeCall()) {
      var now = Date.now();
      var srcIdx = Utils.randomInRange(0, gameObjects.length);
      var dstIdx = Utils.randomInRange(0, gameObjects.length);
      // Make sure you don't add yourself
      if (srcIdx === dstIdx) {
        return false;
      }
      gameObjects[srcIdx].path.addConnection(gameObjects[dstIdx]);
      var mode = LogWindow.MODE_MSG;
      var message = sprintf('%s >::>>link>>::> %s', gameObjects[srcIdx].id, gameObjects[dstIdx].id);
      if (gameObjects[srcIdx].tracked) {
        mode = LogWindow.MODE_WARN;
      }
      logWindow.msg(message, gameObjects[srcIdx].id, mode);
      this.lastCallMade = now;
      this.callCooldown = 200 + Utils.randomInRange(100, 1500);
    }
  }
  canMakeCall() {
    return this.lastCallMade + this.callCooldown < Date.now();
  }
  isSuspect(id) {
    for (var i = 0; i < suspects.length; i++) {
      if (suspects[i].id == id) {
        return true;
      }
    }
    return false;
  }
  render() {
    super.render();
    var halfSize = 8;
    var bmd = this.bmp;
    for (var gIdx = 0; gIdx < gameObjects.length; gIdx++) {
      var node = gameObjects[gIdx];
      if (!node.visible || !node.tracked) {
        continue;
      }
      var path = node.path.connections;
      // Get the starting position (p1)
      var lastX = node.X;
      var lastY = node.Y;
      // Move to the starting position
      bmd.ctx.beginPath();
      bmd.ctx.moveTo(lastX, lastY);
      for (var pIdx = 0; pIdx < path.length; pIdx++) {
        var target = path[pIdx].link;
        if (this.blockList[target.id]) {
          continue;
        }
        bmd.ctx.moveTo(lastX, lastY);
        // Get the target's positions (p2)
        var newX = target.X;
        var newY = target.Y;
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
        lastX = node.X;
        lastY = node.Y;
      }
      bmd.ctx.closePath();
    }
    for (var i = 0; i < gameObjects.length; i++) {
      gameObjects[i].render(bmd.ctx);
    }
  }
}
