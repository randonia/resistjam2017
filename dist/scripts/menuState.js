GAME_TITLE = 'SOMEBODY_IS_LISTENING';
class MenuState {
  create() {
    this.gameStart = Date.now();
    this.timers = [];
    this.fontCFG = {
      font: sprintf('%spx %s', 20, DEFAULT_FONT),
      fill: 'green'
    };
    var titleLabel = game.add.text(80, 80, '', this.fontCFG)
    var startLabel = game.add.text(80, 100, '', this.fontCFG)
    var instructionsLabel = game.add.text(80, 120, '', this.fontCFG);
    this.inputLabel = game.add.text(80, 200, '> ', this.fontCFG);
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
      'delay': 2500,
      'text': sprintf('> %s', 'Make your selection:')
    });
    this.timers.push({
      'label': instructionsLabel,
      'duration': 2500,
      'delay': 5000,
      'text': sprintf('#%s', ' start - start the game\n# itch - visit itch.io page\n# tweet - tweet to me')
    });
  }
  startGame() {
    game.state.start('game');
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
        continue;
      }
      var currLetterIdx = Math.floor(timer.text.length * (now - timer.start) / timer.duration)
      timer.label.text = timer.text.substr(0, currLetterIdx);
    }
    if (this.timers.length == 0) {
      this.inputLabel.text = sprintf('> %s', this.userInput);
    }
  }
}
