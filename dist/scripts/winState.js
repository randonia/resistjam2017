class WinState {
  create() {
    this.menuStart = Date.now();
    this.timers = [];
    this.fontCFG = {
      font: sprintf('%spx %s', 12, DEFAULT_FONT),
      fill: 'green'
    };
    var titleLabel = game.add.text(80, 80, '', this.fontCFG)
    var startLabel = game.add.text(80, 180, '', this.fontCFG)
    var instructionsLabel = game.add.text(80, 200, '', this.fontCFG);
    var textSpeed = (DEBUG) ? 0.2 : 1;
    this.inputLabel = game.add.text(80, 240, '', this.fontCFG);
    this.userInput = '';
    var winMessage = sprintf("> You managed to apprehend our lead suspect: %s. Great work. Technically they haven't\n done anything illegal yet but we've been tracking them for a while and finally\n got you to put the pieces together. They were talking to some pretty shady people,\n so we're glad we got this menace off the streets.", APPREHENDED_SUSPECT.name);
    this.timers.push({
      'label': titleLabel,
      'duration': 4500 * textSpeed,
      'delay': 0,
      'text': winMessage
    });
    this.timers.push({
      'label': startLabel,
      'duration': 1500 * textSpeed,
      'delay': 4500 * textSpeed,
      'text': sprintf('> %s', 'Make your selection:')
    });
    this.timers.push({
      'label': instructionsLabel,
      'duration': 2500 * textSpeed,
      'delay': (4500 + 1500) * textSpeed,
      'text': '# tweet - Tweet sweet, sweet victory\n# menu - Go to the main menu'
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
    console.log(APPREHENDED_SUSPECT);
  }
  update() {
    var now = Date.now();
    for (var i = 0; i < this.timers.length; i++) {
      var timer = this.timers[i];
      if (!timer.start) {
        timer.start = (now > this.menuStart + timer.delay) ? now : undefined;
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
      case 'tweet':
        this.userInput = '';
        this.execTweet();
        break;
      case 'menu':
        this.userInput = '';
        this.execMenu();
        break;
    }
  }
  onDownCallback(event) {
    if (this.timers.length == 0) {
      this.userInput += event;
    }
  }
  execTweet() {
    var url = encodeURI(sprintf('https://twitter.com/intent/tweet?text=I apprehended %s in %s. %s %s', APPREHENDED_SUSPECT.name, GAME_TITLE, ITCH_IO_URL, TWITTER_HANDLE));
    window.open(url);
  }
  execMenu() {
    game.state.start('menu');
  }
}
