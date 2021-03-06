class Utils {
  static randomInRange(low, high) {
    var min = Math.ceil(low);
    var max = Math.floor(high);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  static clamp(low, high, value) {
    return Math.min(Math.max(value, low), high);
  }
}
