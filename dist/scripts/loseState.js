class LoseState {
  create() {
    this.menuStart = Date.now();
    this.timers = [];
    this.fontCFG = {
      font: sprintf('%spx %s', 12, DEFAULT_FONT),
      fill: 'green'
    };
    var titleLabel = game.add.text(80, 80, '', this.fontCFG)
    var startLabel = game.add.text(80, 160, '', this.fontCFG)
    var instructionsLabel = game.add.text(80, 180, '', this.fontCFG);
    this.inputLabel = game.add.text(80, 220, '', this.fontCFG);
    this.userInput = '';
    var textSpeed = (DEBUG) ? 0.1 : 1;
    var failureMessage = undefined;
    if (APPREHENDED_SUSPECT) {
      failureMessage = sprintf("> You arrested the wrong person! %s hadn't done anything wrong and was an\n  upstanding citizen! Now we have to plant some evidence to make it look\n  like we had probable cause. You made us look like fools, and worst of all,\n  cost us money! You're fired!", APPREHENDED_SUSPECT.name);
    } else {
      failureMessage = "> You were discovered and lost the element of surprise. Now\n  we can't track them. You're fired.";
    }
    this.timers.push({
      'label': titleLabel,
      'duration': 4500 * textSpeed,
      'delay': 0,
      'text': failureMessage,
      'lastIdx': -1
    });
    this.timers.push({
      'label': startLabel,
      'duration': 1500 * textSpeed,
      'delay': 4500 * textSpeed,
      'text': sprintf('> %s', 'Make your selection:'),
      'lastIdx': -1
    });
    this.timers.push({
      'label': instructionsLabel,
      'duration': 2500 * textSpeed,
      'delay': (4500 + 1500) * textSpeed,
      'text': '# restart - Try again\n# menu - Go to the main menu',
      'lastIdx': -1
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
      if (currLetterIdx != timer.lastIdx) {
        playRandomKey();
        timer.lastIdx = currLetterIdx;
      }
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
    playRandomKey();
  }
  onEnter(event) {
    switch (this.userInput) {
      case 'restart':
        this.userInput = '';
        this.execStart();
        break;
      case 'menu':
        this.userInput = '';
        this.execMenu();
        break;
    }
    playRandomKey();
  }
  onDownCallback(event) {
    if (this.timers.length == 0) {
      this.userInput += event;
    }
    playRandomKey();
  }
  execStart() {
    game.state.start('game');
  }
  execMenu() {
    game.state.start('menu');
  }
}
