class Blinker {
  constructor(offTime, onTime) {
    this.lastFlipTime = Number.MIN_VALUE;
    this.offTime = offTime;
    this.onTime = onTime;
    this.value = false;
  }
  blink() {
    var now = Date.now();
    if (this.value) {
      if (this.lastFlipTime + this.onTime < now) {
        this.lastFlipTime = now;
        this.value = !this.value;
      }
    } else {
      if (this.lastFlipTime + this.offTime < now) {
        this.lastFlipTime = now;
        this.value = !this.value;
      }
    }
    return this.value;
  }
}
