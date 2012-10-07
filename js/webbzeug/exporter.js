(function() {
  var Exporter, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.Exporter = Exporter = (function() {

    function Exporter() {}

    Exporter.prototype.actionsToDataURL = function(actions) {
      var action, index, param, value, _ref1;
      this.output = '';
      this.startStream();
      this.output += '\x02';
      for (index in actions) {
        action = actions[index];
        this.output += '\x03';
        this.output += Webbzeug.Utilities.stringToByte(action.type);
        this.output += '\x04';
        this.writeData(action.index);
        this.output += '\x05';
        this.writeData(action.x);
        this.output += '\x05';
        this.writeData(action.y);
        this.output += '\x05';
        this.writeData(action.width);
        this.output += '\x05';
        _ref1 = action.parameters;
        for (param in _ref1) {
          value = _ref1[param];
          this.output += '\x07';
          this.output += Webbzeug.Utilities.stringToByte(param);
          this.output += '\x08';
          this.writeData(value);
        }
        this.output += '\xff';
      }
      return "data:application/octet-stream;base64," + Base64.encode(this.output);
    };

    Exporter.prototype.writeData = function(data) {
      var stringifiedObj;
      if (typeof data === 'number' && parseInt(data) === data) {
        this.output += '\xfa';
        this.output += chr(data & 0xff);
      }
      if (typeof data === 'string') {
        this.output += '\xfb';
        this.output += chr(data.length & 0xff);
        this.output += data;
      }
      if (typeof data === 'object') {
        stringifiedObj = JSON.stringify(data);
        this.output += '\xfc';
        this.output += chr(stringifiedObj.length & 0xff);
        return this.output += stringifiedObj;
      }
    };

    Exporter.prototype.startStream = function() {
      this.output += 'WZ';
      this.output += '\x01';
      return this.output += Webbzeug.Utilities.versionToInt(Webbzeug.Version);
    };

    Exporter.prototype.debugPrint = function(str) {
      var c, e, h, r;
      r = "";
      e = str.length;
      c = 0;
      while (c < e) {
        h = str.charCodeAt(c++).toString(16);
        while (h.length < 2) {
          h = "0" + h;
        }
        r += " " + h;
      }
      return console.log(str.length, "<Object" + r + ">");
    };

    return Exporter;

  })();

}).call(this);
