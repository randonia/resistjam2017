var DBGWINDOW = undefined;
class GameState {
  constructor(payload) {}
  preload() {
    game.load.spritesheet('nodes', 'assets/sprites/nodes.png', 16, 16, 5);
  }
  create() {
    this.gameObjects = [];
    this.windowStack = [];
    // Create the three window panels
    this.initWindowStack();
    // Initialize the shader
    this.initShader();
    // Handle inputs
    this.initKeyboardHandlers();
  }
  initWindowStack() {
    this.currentWindowIndex = 0;
    // This ensures the mapwindow is the lowest order
    var mapWindow = new MapWindow();
    DBGWINDOW = mapWindow;
    this.windowStack.push(new FilterWindow());
    this.windowStack.push(mapWindow);
    this.windowStack.push(new LogWindow());
    this.windowStack.push(new CommandWindow());
  }
  initKeyboardHandlers() {
    this.keys = {};
    var state = this;
    // Window Tabbery key
    var keyTab = game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    keyTab.onDown.add(this.onTabKey, this);
    this.keys['tab'] = keyTab;
    // Backspace key
    var keyBackspace = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
    keyBackspace.onDown.add(this.onBackspace, this);
    this.keys['backspace'] = keyBackspace;
    // Enter key
    var keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    keyEnter.onDown.add(this.onEnter, this);
    this.keys['enter'] = keyEnter;
    // Plaintext input
    this.game.input.keyboard.onPressCallback = function(event) {
      state.onDownCallback(event, this);
    };
  }
  onTabKey(event) {
    this._submitEvent('onTabKey', event);
  }
  onBackspace(event) {
    this._submitEvent('onBackspace', event);
  }
  onEnter(event) {
    this._submitEvent('onEnter', event);
  }
  onDownCallback(event) {
    this._submitEvent('onDownCallback', event);
  }
  _submitEvent(funcName, event) {
    for (var i = 0; i < this.windowStack.length; i++) {
      this.windowStack[i][funcName](event);
    }
  }
  initShader() {
    // Taken from and modified: http://glslsandbox.com/e#18578.0
    var fragmentSrc = [
        "precision mediump float;",

        "uniform float     time;",
        "uniform vec2      resolution;",
        "uniform vec2      mouse;",

        "float noise(vec2 pos) {",
            "return fract(sin(dot(pos, vec2(12.9898 - time,78.233 + time))) * 43758.5453);",
        "}",

        "void main( void ) {",
            "vec2 normalPos = gl_FragCoord.xy / resolution.xy;",
            "float pos = (gl_FragCoord.y / resolution.y);",
            "float mouse_dist = length(vec2((mouse.x - normalPos.x) * (resolution.x / resolution.y) , mouse.y - normalPos.y));",
            // "float distortion = clamp(1.0 - (mouse_dist + 0.1) * 3.0, 0.0, 1.0);",

            // "pos -= (distortion * distortion) * 0.1;",

            "float c = sin(pos * 400.0) * 0.4 + 0.4;",
            "c = pow(c, 0.2);",
            "c *= 0.2;",

            "float band_pos = fract(time * 0.1) * 3.0 - 1.0;",
            "c += clamp( (1.0 - abs(band_pos - pos) * 10.0), 0.0, 1.0) * 0.1;",

            // "c += distortion * 0.08;",
            "// noise",
            "c += (noise(gl_FragCoord.xy) - 0.5) * (0.09);",
            "gl_FragColor = vec4( 0.0, c, 0.0, 0.5 );",
        "}"
    ];
    this.scanlineFilter = new Phaser.Filter(game, null, fragmentSrc);
    this.scanlineFilter.setResolution(800, 600);
    this.scanlineSprite = game.add.sprite();
    this.scanlineSprite.blendMode = PIXI.blendModes.ADD;
    this.scanlineSprite.width = 800;
    this.scanlineSprite.height = 600;
    this.scanlineSprite.filters = [this.scanlineFilter];
  }
  getWindow(windowType) {
    for (var i = 0; i < this.windowStack.length; i++) {
      if (this.windowStack[i].type == windowType) {
        return this.windowStack[i];
      }
    }
  }
  update() {
    for (var i = 0; i < this.windowStack.length; i++) {
      this.windowStack[i].update();
    }
    for (var i = this.gameObjects.length - 1; i >= 0; i--) {
      this.gameObjects[i].update();
    }
  }
  render() {
    for (var i = this.windowStack.length - 1; i >= 0; i--) {
      this.windowStack[i].render();
    }
    for (var i = this.gameObjects.length - 1; i >= 0; i--) {
      this.gameObjects[i].render();
    }
    this.scanlineFilter.update(game.input.mousePointer);
  }
}
