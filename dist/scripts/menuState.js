GAME_TITLE = 'SOMEBODY_IS_LISTENING';
TWITTER_HANDLE = '@zambini845';
ITCH_IO_URL = 'https://zambini.itch.io/somebody-is-listening'
class MenuState {
  create() {
    this.gameStart = Date.now();
    this.timers = [];
    this.fontCFG = {
      font: sprintf('%spx %s', 12, DEFAULT_FONT),
      fill: 'green'
    };
    var titleLabel = game.add.text(80, 80, '', this.fontCFG)
    var startLabel = game.add.text(80, 100, '', this.fontCFG)
    var instructionsLabel = game.add.text(80, 120, '', this.fontCFG);
    this.inputLabel = game.add.text(80, 180, '', this.fontCFG);
    this.userInput = '';
    this.timers.push({
      'label': titleLabel,
      'duration': 2500,
      'delay': 0,
      'text': sprintf('> %s', GAME_TITLE)
    });
    this.timers.push({
      'label': startLabel,
      'duration': 2500,
      'delay': 2700,
      'text': sprintf('> %s', 'Make your selection:')
    });
    this.timers.push({
      'label': instructionsLabel,
      'duration': 2500,
      'delay': 5500,
      'text': sprintf('#%s', ' start - start the game\n# itch - visit itch.io page\n# tweet - tweet to me')
    });
    this.blinker = new Blinker(500, 200);
    // Plaintext input
    var state = this;
    this.game.input.keyboard.onPressCallback = function(event) {
      state.onDownCallback(event, this);
    };
    // Backspace key
    var keyBackspace = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
    keyBackspace.onDown.add(this.onBackspace, this);
    // Enter key
    var keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    keyEnter.onDown.add(this.onEnter, this);
  }
  update() {
    var now = Date.now();
    for (var i = 0; i < this.timers.length; i++) {
      var timer = this.timers[i];
      if (!timer.start) {
        timer.start = (now > this.gameStart + timer.delay) ? now : undefined;
        return;
      }
      if (timer.start + timer.duration < now) {
        timer.label.text = timer.text;
        this.timers.splice(i, 1);
        i--;
        continue;
      }
      var currLetterIdx = Math.floor(timer.text.length * (now - timer.start) / timer.duration)
      timer.label.text = sprintf('%s%s', timer.text.substr(0, currLetterIdx), (this.blinker.blink()) ? '_' : '');
    }
    if (this.timers.length == 0) {
      this.inputLabel.text = sprintf('> %s%s', this.userInput, (this.blinker.blink()) ? '_' : '');
    }
  }
  onBackspace(event) {
    if (this.timers.length == 0) {
      this.userInput = this.userInput.substr(0, this.userInput.length - 1);
    }
  }
  onEnter(event) {
    switch (this.userInput) {
      case 'start':
        this.userInput = '';
        this.execStart();
        break;
      case 'itch':
        this.userInput = '';
        this.execItch();
        break;
      case 'tweet':
        this.userInput = '';
        this.execTweet();
        break;
    }
  }
  onDownCallback(event) {
    if (this.timers.length == 0) {
      this.userInput += event;
    }
  }
  execStart() {
    game.state.start('game');
  }
  execItch() {
    var url = ITCH_IO_URL;
    window.open(url);
  }
  execTweet() {
    var url = encodeURI(sprintf('https://twitter.com/intent/tweet?text=Playing "%s" by %s. %s', GAME_TITLE, TWITTER_HANDLE, ITCH_IO_URL));
    window.open(url);
  }
}
