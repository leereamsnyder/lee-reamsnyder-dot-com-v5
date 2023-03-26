// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
if (typeof window !== 'undefined' && window.NodeList && !window.NodeList.prototype.forEach) {
  window.NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this)
    }
  }
}
