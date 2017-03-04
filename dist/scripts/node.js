class Node {
  static get TYPE_A() {
    return 1001;
  }
  static get TYPE_B() {
    return 1002;
  }
  static get TYPE_C() {
    return 1003;
  }
  static get TYPE_D() {
    return 1004;
  }
  static get TYPE_E() {
    return 1005;
  }
  static getFrameFromType(type) {
    switch (type) {
      case Node.TYPE_A:
        return 1;
      case Node.TYPE_B:
        return 2;
      case Node.TYPE_C:
        return 3;
      case Node.TYPE_D:
        return 4;
      case Node.TYPE_E:
        return 5;
      default:
        return -1;
    }
  }
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.id = this.generateId(type);
    this.sprite = game.add.sprite(x, y, 'nodes');
    this.sprite.frame = Node.getFrameFromType(type);
  }
  update() {}
  render() {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }
  generateId(type) {
    return
  }
}
