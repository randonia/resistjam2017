var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container');
game.state.add('menu', new MenuState());
game.state.add('game', new GameState());
game.state.add('lose', new LoseState());
game.state.add('win', new WinState());
game.state.start('menu');
