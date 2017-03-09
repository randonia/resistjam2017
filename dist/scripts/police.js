APPREHENDED_SUSPECT = undefined;
class Police {
  get X() {
    return this._x + 8;
  }
  get Y() {
    return this._y + 8;
  }
  constructor(target) {
    this.target = target;
    var randX = Math.random() < 0.5 ? 0 : WINDOW_MAP_WIDTH;
    var randY = Utils.randomInRange(0, WIN_HEIGHT);
    this._x = randX;
    this._y = randY;
    this.sprite = game.add.sprite(randX, randY, 'nodes');
    this.sprite.frame = 9;
    mapWindow.police = this;
    mapWindow.sprite.addChild(this.sprite);
  }
  update() {
    var dX = this.target.X - this.X;
    var dY = this.target.Y - this.Y;
    if (Math.abs(dX) < 4 && Math.abs(dY) < 4) {
      // End the game
      APPREHENDED_SUSPECT = this.target;
      if (roundTarget.id == this.target.id) {
        // Win
        game.state.start('win');
      } else {
        // Lose
        game.state.start('lose');
      }
    } else {
      if (Math.abs(dX) < Math.abs(dY)) {
        this._y += (0 < dY) ? 1 : -1;
      } else {
        this._x += (0 < dX) ? 1 : -1;
      }
    }
    this.sprite.x = this._x;
    this.sprite.y = this._y;
  }
  render() {
    var ctx = mapWindow.bmp.ctx;
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(82,127,57)';
    ctx.moveTo(this.X, this.Y);
    ctx.lineTo(this.target.X, this.target.Y);
    ctx.stroke();
    ctx.closePath();
  }
}
