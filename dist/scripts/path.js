class TrackedPath {
  constructor(owner) {
    this.owner = owner;
    this.connections = [];
  }
  addConnection(other) {
    console.log(sprintf("%s calling %s", this.owner.name, other.name));
    this.connections.push({
      'link': other,
      'timestamp': Date.now()
    })
  }
}
