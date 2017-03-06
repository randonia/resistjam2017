class Node {
  static get TYPE_A() {
    return 'SUBJ_A';
  }
  static get TYPE_B() {
    return 'SUBJ_B';
  }
  static get TYPE_C() {
    return 'SUBJ_C';
  }
  static get TYPE_D() {
    return 'SUBJ_D';
  }
  static get TYPE_E() {
    return 'SUBJ_E';
  }
  static getTypes() {
    return [
      Node.TYPE_A, Node.TYPE_B, Node.TYPE_C, Node.TYPE_D, Node.TYPE_E
    ]
  }
  static getFrameFromType(type) {
    switch (type) {
      case Node.TYPE_A:
        return 0;
      case Node.TYPE_B:
        return 1;
      case Node.TYPE_C:
        return 2;
      case Node.TYPE_D:
        return 3;
      case Node.TYPE_E:
        return 4;
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
    this.path = [];
    this.visible = true;
  }
  update() {}
  render() {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }
  generateId(type) {
    return Math.random();
  }
  setVisible(value) {
    this.visible = value;
    this.sprite.visible = this.visible;
  }
  addToPath(otherNode) {
    this.path.push(otherNode);
  }
}
