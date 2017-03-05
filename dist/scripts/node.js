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
    this.path = [];
  }
  update() {}
  render() {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }
  generateId(type) {
    return Math.random();
  }
  addToPath(otherNode) {
    this.path.push(otherNode);
  }
}
