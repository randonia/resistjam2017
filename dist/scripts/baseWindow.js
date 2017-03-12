// Window Consts
DEFAULT_FONTSIZE = 16;
DEFAULT_FONT = 'Anonymous Pro, monospace';
WIN_CMDHEIGHT = 100;
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
  static get TYPE_HEADER() {
    return 'HEADER';
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
    this.textBmp = game.add.bitmapData(this.width, this.height);
    this.textSprite = game.add.sprite(this.x, this.y, this.textBmp);
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
    this.textBmp.clear();
  }
  addChild(sprite) {
    this.sprite.addChild(sprite);
  }
  drawText(x, y, message, size = undefined, align = undefined, color = undefined) {
    var bmd = this.bmp;
    bmd.ctx.font = sprintf("%spx %s", (size || DEFAULT_FONTSIZE), DEFAULT_FONT);
    bmd.ctx.textAlign = align || 'start';
    bmd.ctx.fillStyle = 'black';
    bmd.ctx.fillText(message, x + 1, y + 1);
    bmd.ctx.fillStyle = color || 'green';
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
  onUpArrow(event) {} // Empty event default
  onDownArrow(event) {} // Empty event default
  onPageUp(event) {} // Empty event default
  onPageDown(event) {} // Empty event default
}
