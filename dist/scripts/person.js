NAME_LETTERS = ['​‌A', '​‌B', '​‌C', '​‌Ć', '​‌Č', '​‌D', '​‌Đ', '​‌E', '​‌F', '​‌G', '​‌H', '​‌I', '​‌J', '​‌K', '​‌L', '​‌M', '​‌N', '​‌O', '​‌P', '​‌Q', '​‌R', '​‌S', '​‌Š', '​‌T', '​‌U', '​‌V', '​‌W', '​‌X', '​‌Y', '​‌Z', '​‌Ž', '​‌А', '​‌Б', '​‌В', '​‌Г', '​‌Д', '​‌Е', '​‌Ё', '​‌Ж', '​‌З', '​‌И', '​‌Й', '​‌К', '​‌Л', '​‌М', '​‌Н', '​‌О', '​‌П', '​‌Р', '​‌С', '​‌Т', '​‌У', '​‌Ф', '​‌Х', '​‌Ц', '​‌Ч', '​‌Ш', '​‌Щ', '​‌Ъ', '​‌Ы', '​‌Ь', '​‌Э', '​‌Ю', '​‌Я', '​‌а', '​‌б', '​‌в', '​‌г', '​‌д', '​‌е', '​‌ё', '​‌ж', '​‌з', '​‌и', '​‌й', '​‌к', '​‌л', '​‌м', '​‌н', '​‌о', '​‌п', '​‌р', '​‌с', '​‌т', '​‌у', '​‌ф', '​‌х', '​‌ц', '​‌ч', '​‌ш', '​‌щ', '​‌ъ', '​‌ы', '​‌ь', '​‌э', '​‌ю', '​‌я', '​‌Α', '​‌Β', '​‌Γ', '​‌Δ', '​‌Ε', '​‌Ζ', '​‌Η', '​‌Θ', '​‌Ι', '​‌Κ', '​‌Λ', '​‌Μ', '​‌Ν', '​‌Ξ', '​‌Ο', '​‌Π', '​‌Ρ', '​‌Σ', '​‌Τ', '​‌Υ', '​‌Φ', '​‌Χ', '​‌Ψ', '​‌Ω', '​‌α', '​‌β', '​‌γ', '​‌δ', '​‌ε', '​‌ζ', '​‌η', '​‌θ', '​‌ι', '​‌κ', '​‌λ', '​‌μ', '​‌ν', '​‌ξ', '​‌ο', '​‌π', '​‌ρ', '​‌σ', '​‌τ', '​‌υ', '​‌φ', '​‌χ', '​‌ψ', '​‌ω'];
class Person {
  static generateName() {
    return sprintf('%s-%s[%s]', Person.randomLetter(), Person.randomLetter(), Person.randomNumber());
  }
  static randomLetter() {
    return NAME_LETTERS[Utils.randomInRange(0, NAME_LETTERS.length)];
  }
  static randomNumber() {
    return Utils.randomInRange(100, 999);
  }
  constructor(x, y) {
    this._x = x;
    this._y = y;
    this.name = Person.generateName();
    this.path = [];
    this.sprite = game.add.sprite(x, y, 'nodes');
    this.sprite.frame = (Math.random() < 0.25) ? 4 : (Math.random() < 0.5) ? 5 : (Math.random() < 0.75) ? 6 : 7;
    this.target = undefined;
    this.moveDelay = 500;
    this.lastMove = Number.MIN_VALUE;
    this.selected = false;
  }
  update() {
    var now = Date.now();
    if (this.target && this.canMove()) {
      var dX = this.target.X - this.X;
      var dY = this.target.Y - this.Y;
      if (Math.abs(dX) < Math.abs(dY)) {
        this._y += (0 < dY) ? 1 : -1;
      } else {
        this._x += (0 < dX) ? 1 : -1;
      }
      this.lastMove = now;
    } else {
      if (Math.random() < 0.05) {
        var dirX = Math.random() - 0.5;
        var dirY = Math.random() - 0.5;
        this._x += dirX;
        this._y += dirY;
        // Bounds correcting
        if (this._x < 0) {
          this._x += 1;
        }
        if (WIN_WIDTH / 2 - NODE_SIZE < this._x) {
          this._x -= 1;
        }
        if (this._y < 0) {
          this._y += 1;
        }
        if (WIN_HEIGHT - WIN_CMDHEIGHT - NODE_SIZE < this._y) {
          this._y -= 1;
        }
      }
    }
  }
  canMove() {
    return this.lastMove + this.moveDelay < Date.now();
  }
  render() {
    var ctx = mapWindow.bmp.ctx;
    this.sprite.x = this._x;
    this.sprite.y = this._y;
    var textX = (this.X < WIN_WIDTH / 2 - 65) ? this.X + 8 : this.X - 55;
    ctx.font = sprintf("%spx %s", 11, DEFAULT_FONT);
    ctx.strokeStyle = 'black';
    ctx.strokeText(this.name, textX, this.Y);
    ctx.fillStyle = (this.selected) ? 'red' : 'gray';
    ctx.fillText(this.name, textX, this.Y);
    if (this.target) {
      ctx.beginPath();
      ctx.lineWidth = '1';
      ctx.strokeStyle = 'gray';
      ctx.moveTo(this.X, this.Y);
      ctx.lineTo(this.target.X, this.target.Y);
      ctx.stroke();
      ctx.closePath();
    }
  }
  getAbbreviation() {
    return sprintf('%s.', this.name.split(' ').map(function(item) {
      return item[0];
    }).join('.'));
  }
  get X() {
    return this._x + 8;
  }
  get Y() {
    return this._y + 8;
  }
}
