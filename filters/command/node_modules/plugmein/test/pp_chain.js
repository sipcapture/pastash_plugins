module.exports = function plugin() {
  this.chain = function() {
    // return this to allow chaining on this function
    return this;
  }
}
