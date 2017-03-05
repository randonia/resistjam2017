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
