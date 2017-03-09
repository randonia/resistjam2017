class TrackedPath {
  constructor(owner) {
    this.owner = owner;
    this.connections = [];
    this.history = [];
  }
  addConnection(other) {
    this.connections.push({
      'link': other,
      'timestamp': Date.now()
    })
  }
  setHistory(history) {
    if (this.history.length > 0) {
      return;
    }
    for (var i = 0; i < history.length; i++) {
      this.addConnection(history[i]);
    }
    this.history = history;
  }
}
