(function() {
  window.ShaderScript = (function() {
    function _Class(url, type) {
      this.url = url;
      this.type = type;
      return;
    }

    _Class.prototype.load = function(callback) {
      var request,
        _this = this;
      request = new XMLHttpRequest;
      request.open('GET', this.url, true);
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          _this.script = request.responseText;
          return callback(_this.script);
        }
      };
      return request.send(null);
    };

    _Class.prototype.compile = function(gl) {
      var shader;
      shader = gl.createShader(this.type);
      gl.shaderSource(shader, this.script);
      gl.compileShader(shader);
      return shader;
    };

    return _Class;

  })();

}).call(this);
