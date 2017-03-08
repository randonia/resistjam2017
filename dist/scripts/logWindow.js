// Right Window - for showing the log
class LogWindow extends BaseWindow {
  static MODE_MSG() {
    return 0;
  }
  static MODE_WARN() {
    return 1;
  }
  static MODE_ALERT() {
    return 2;
  }
  static getColor(mode) {
    switch (mode) {
      case LogWindow.MODE_MSG():
        return 'gray';
      case LogWindow.MODE_WARN():
        return 'yellow';
      case LogWindow.MODE_ALERT():
        return 'red';
    }
  }
  constructor() {
    super(3 * WIN_WIDTH / 4, 0, WIN_WIDTH / 4, WIN_HEIGHT - WIN_CMDHEIGHT, BaseWindow.TYPE_LOG);
    this.logs = [];
    this.lastAdd = Date.now();
  }
  msg(message, mode = undefined) {
    this.logs.push({
      'message': message,
      'mode': (mode) ? mode() : LogWindow.MODE_MSG()
    });
  }
  render() {
    super.render();
    var logLen = this.logs.length;
    for (var i = logLen - 1; i >= 0; i--) {
      var log = this.logs[i];
      this.drawText(5, this.height - (logLen - i) * 13, log.message, 13, undefined, LogWindow.getColor(log.mode));
    }
  }
}
