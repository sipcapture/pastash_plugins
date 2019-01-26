module.exports = function plugin() {

  this.multiply = function(a,b,data) {
    var sin = false;
    if(!Array.isArray(data)) { data = [data]; sin = true; }
    for (var set of data) {
      if(set[a]) set[a] = set[a] * b
    }
    return sin ? data[0] : data;
  }

  this.divide = function(a,b,data) {
    var sin = false;
    if(!Array.isArray(data)) { data = [data]; sin = true; }
    for (var set of data) {
      if(set[a]) set[a] = set[a] / b
    }
    return sin ? data[0] : data;
  }

}


