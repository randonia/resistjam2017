NAME_LETTERS = ['​‌A', '​‌B', '​‌C', '​‌Ć', '​‌Č', '​‌D', '​‌Đ', '​‌E', '​‌F', '​‌G', '​‌H', '​‌I', '​‌J', '​‌K', '​‌L', '​‌M', '​‌N', '​‌O', '​‌P', '​‌Q', '​‌R', '​‌S', '​‌Š', '​‌T', '​‌U', '​‌V', '​‌W', '​‌X', '​‌Y', '​‌Z', '​‌Ž', '​‌А', '​‌Б', '​‌В', '​‌Г', '​‌Д', '​‌Е', '​‌Ё', '​‌Ж', '​‌З', '​‌И', '​‌Й', '​‌К', '​‌Л', '​‌М', '​‌Н', '​‌О', '​‌П', '​‌Р', '​‌С', '​‌Т', '​‌У', '​‌Ф', '​‌Х', '​‌Ц', '​‌Ч', '​‌Ш', '​‌Щ', '​‌Ъ', '​‌Ы', '​‌Ь', '​‌Э', '​‌Ю', '​‌Я', '​‌а', '​‌б', '​‌в', '​‌г', '​‌д', '​‌е', '​‌ё', '​‌ж', '​‌з', '​‌и', '​‌й', '​‌к', '​‌л', '​‌м', '​‌н', '​‌о', '​‌п', '​‌р', '​‌с', '​‌т', '​‌у', '​‌ф', '​‌х', '​‌ц', '​‌ч', '​‌ш', '​‌щ', '​‌ъ', '​‌ы', '​‌ь', '​‌э', '​‌ю', '​‌я', '​‌Α', '​‌Β', '​‌Γ', '​‌Δ', '​‌Ε', '​‌Ζ', '​‌Η', '​‌Θ', '​‌Ι', '​‌Κ', '​‌Λ', '​‌Μ', '​‌Ν', '​‌Ξ', '​‌Ο', '​‌Π', '​‌Ρ', '​‌Σ', '​‌Τ', '​‌Υ', '​‌Φ', '​‌Χ', '​‌Ψ', '​‌Ω', '​‌α', '​‌β', '​‌γ', '​‌δ', '​‌ε', '​‌ζ', '​‌η', '​‌θ', '​‌ι', '​‌κ', '​‌λ', '​‌μ', '​‌ν', '​‌ξ', '​‌ο', '​‌π', '​‌ρ', '​‌σ', '​‌τ', '​‌υ', '​‌φ', '​‌χ', '​‌ψ', '​‌ω'];
idPool = {}
class Person {
  static generateName() {
    return sprintf('%s.%s%s', Person.randomLetter(), Person.randomLetter(), Person.randomLetter());
  }
  static randomLetter() {
    return NAME_LETTERS[Utils.randomInRange(0, NAME_LETTERS.length)];
  }
  static generateID() {
    var newId = undefined;
    do {
      newId = sprintf('%s.%s', Utils.randomInRange(10, 99), Utils.randomInRange(100, 999));
      if (!idPool[newId]) {
        idPool[newId] = 1;
      }
    } while (!idPool[newId])
    return newId;
  }
  static randomNumber() {
    return Utils.randomInRange(100, 999);
  }
  constructor(x, y) {
    this._x = x;
    this._y = y;
    this.name = Person.generateName();
    this.id = Person.generateID();
    this.path = new TrackedPath(this);
    this.sprite = game.add.sprite(x, y, 'nodes');
    this.sprite.frame = (Math.random() < 0.25) ? 4 : (Math.random() < 0.5) ? 5 : (Math.random() < 0.75) ? 6 : 7;
    this.moveDelay = (DEBUG) ? 50 : 500;
    this.lastMove = Number.MIN_VALUE;
    this.selected = false;
    this.visible = true;
    this.tracked = false;
    this.trackCount = 0;
  }
  setHistory(history) {
    this.path.setHistory(history);
  }
  setVisible(val) {
    this.visible = val;
    this.sprite.visible = val;
  }
  setTracked(val) {
    this.tracked = val;
    // Inc or dec each target this is tracking. Used to determine if it should render its text
    for (var i = 0; i < this.path.connections.length; i++) {
      this.path.connections[i].link.trackCount += (val) ? 1 : 0;
    }
  }
  update() {
    var now = Date.now();
    // Meander about
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
    this.sprite.x = this._x;
    this.sprite.y = this._y;
  }
  render() {
    if (!this.visible || mapWindow.blockList[this.id]) {
      return;
    }
    if (this.tracked || this.trackCount > 0) {
      var ctx = mapWindow.textBmp.ctx;
      var textX = (this.X < WIN_WIDTH / 2 - 65) ? this.X + 8 : this.X - 55;
      ctx.font = sprintf("%spx %s", 11, DEFAULT_FONT);
      var drawStr = sprintf('%s %s', this.name, this.id);
      ctx.lineJoin = 'bevel';
      ctx.strokeStyle = 'black';
      ctx.strokeText(drawStr, textX, this.Y);
      ctx.fillStyle = (this.tracked) ? 'yellow' : 'rgb(180,180,180)';
      ctx.fillText(drawStr, textX, this.Y);
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
