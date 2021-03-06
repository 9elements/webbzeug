(function() {
  var Importer;

  if (window.Webbzeug == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.Importer = Importer = (function() {
    Importer.prototype.debug = true;

    function Importer(app) {
      this.app = app;
      return;
    }

    Importer.prototype.loadData = function(data) {
      var byte, i, identifier, version, _i, _ref;
      this.data = data;
      this.maxIndex = 0;
      this.actions = [];
      identifier = this.readBytes(2);
      if (identifier !== 'WZ') {
        alert('This file is not a webbzeug file! (File identifier not found)');
        return false;
      }
      if (this.debug) {
        console.log("Parsing file...");
      }
      for (i = _i = 3, _ref = this.data.length; 3 <= _ref ? _i < _ref : _i > _ref; i = 3 <= _ref ? ++_i : --_i) {
        byte = this.readBytes(1);
        if (byte === '\x01') {
          version = this.readBytesUntil('\x02');
          if (version > Webbzeug.Utilities.versionToInt(Webbzeug.Version)) {
            alert('This file has been created with a newer version of webbzeug! (' + version + ' > ' + Webbzeug.Utilities.versionToInt(Webbzeug.Version));
            return false;
          }
          if (this.debug) {
            console.log('File version', version);
          }
        }
        if (byte === '\x03') {
          this.readAction();
        }
      }
      return this.app.incrementalIndex = this.maxIndex + 1;
    };

    Importer.prototype.importDataURL = function(data) {
      var b64encodedData, splitData;
      splitData = data.split('base64,');
      b64encodedData = splitData[1];
      data = Base64.decode(b64encodedData);
      this.loadData(data);
      return true;
    };

    Importer.prototype.readAction = function() {
      var action, byte, el, index, parameterKey, parameterVal, type, width, x, y, _results;
      type = this.readBytesUntil('\x04');
      if (this.debug) {
        console.log('Action type', type);
      }
      index = this.readData();
      this.readBytes(1);
      x = this.readData();
      this.readBytes(1);
      y = this.readData();
      this.readBytes(1);
      width = this.readData();
      this.readBytes(1);
      if (this.debug) {
        console.log("Action index", index, "x", x, "y", y, "width", width);
      }
      el = this.app.newActionElement(x * this.app.gridWidth, y * this.app.gridHeight, Webbzeug.ClassMap[type].name, width, Webbzeug.ClassMap[type].type);
      action = this.app.applyActionToElement(type, x, y, width, index, el);
      this.maxIndex = Math.max(index, this.maxIndex);
      parameterKey = null;
      parameterVal = null;
      _results = [];
      while ((byte = this.readBytes(1)) !== '\xff') {
        if (byte === '\x07') {
          parameterKey = this.readBytesUntil('\x08');
          parameterVal = this.readData();
          if (this.debug) {
            console.log("Action parameter", parameterKey, parameterVal);
          }
          _results.push(action.setParameter(parameterKey, parameterVal));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Importer.prototype.readData = function() {
      var stringLength, val, valueType;
      valueType = this.readBytes(1);
      if (valueType === '\xfa') {
        val = this.readInt();
      }
      if (valueType === '\xfe') {
        val = this.readInt16();
      }
      if (valueType === '\xfb') {
        stringLength = this.readInt();
        val = this.readBytes(stringLength);
      }
      if (valueType === '\xfd') {
        stringLength = this.readInt();
        val = parseFloat(this.readBytes(stringLength, false));
      }
      if (valueType === '\xfc') {
        stringLength = this.readInt();
        val = JSON.parse(this.readBytes(stringLength));
      }
      return val;
    };

    Importer.prototype.readInt = function() {
      var int;
      int = ord(this.data[0]);
      this.data = this.data.slice(1);
      return int;
    };

    Importer.prototype.readInt16 = function() {
      var int;
      int = ord(this.data[0]);
      int += ord(this.data[1]);
      return int;
    };

    Importer.prototype.readBytes = function(count, translate) {
      var bytes;
      if (translate == null) {
        translate = true;
      }
      bytes = this.data.slice(0, count);
      this.data = this.data.slice(count);
      if (translate) {
        bytes = Webbzeug.Utilities.bytesToString(bytes);
      }
      return bytes;
    };

    Importer.prototype.readBytesUntil = function(findChar, eatChar) {
      var byte, bytes, i, _i, _ref;
      if (eatChar == null) {
        eatChar = true;
      }
      bytes = '';
      for (i = _i = 0, _ref = this.data.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        byte = this.data[i];
        if (byte !== findChar) {
          bytes += byte;
        } else {
          break;
        }
      }
      this.data = this.data.slice(bytes.length);
      if (eatChar) {
        this.readBytes(1);
      }
      bytes = Webbzeug.Utilities.bytesToString(bytes);
      return bytes;
    };

    Importer.prototype.debugPrint = function(str) {
      var c, e, h, r;
      if (!this.debug) {
        return false;
      }
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

    return Importer;

  })();

}).call(this);
