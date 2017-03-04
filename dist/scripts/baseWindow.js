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
  render() {
    var bmd = this.bmp;
    bmd.clear();
    bmd.ctx.lineWidth = "2";
    bmd.ctx.strokeStyle = (this.selected) ? "green" : "#535f53";
    bmd.ctx.strokeRect(0, 0, this.width, this.height);
  }
  update() {}
  drawText(x, y, message, size = undefined) {
    var bmd = this.bmp;
    bmd.ctx.font = (size || 12) + 'px Source Code Pro';
    bmd.ctx.fillStyle = 'black';
    bmd.ctx.fillText(message, x + 1, y + 1);
    bmd.ctx.fillStyle = 'green';
    bmd.ctx.fillText(message, x, y);
  }
}
// Left hand window - for filtering
class FilterWindow extends BaseWindow {
  constructor() {
    super(0, 0, 200, 600);
  }
  render() {
    super.render();
  }
}
// Center Window - for showing the map
class MapWindow extends BaseWindow {
  constructor() {
    super(200, 0, 400, 600);
  }
}
// Right Window - for showing the log
class LogWindow extends BaseWindow {
  constructor() {
    super(600, 0, 400, 600);
    this.logs = [];
    this.lastAdd = Date.now();
  }
  update() {
    super.update();
    if (Date.now() - this.lastAdd > 500) {
      this.logs.push("HI " + Date.now());
      this.lastAdd = Date.now();
    }
  }
  render() {
    super.render();
    for (var i = this.logs.length - 1; i >= 0; i--) {
      this.drawText(5, 15 + i * 12, this.logs[i], 12);
    }
  }
}
