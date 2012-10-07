(function() {
  var Importer, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.Importer = Importer = (function() {

    function Importer() {}

    Importer.prototype.dataURLToActions = function(data) {
      var b64encodedData, byte, i, identifier, splitData, version, _i, _ref1;
      splitData = data.split('base64,');
      b64encodedData = splitData[1];
      this.data = Base64.decode(b64encodedData);
      identifier = this.readBytes(2);
      if (identifier !== 'WZ') {
        alert('This file is not a webbzeug file! (File identifier not found)');
        return false;
      }
      for (i = _i = 3, _ref1 = this.data.length; 3 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 3 <= _ref1 ? ++_i : --_i) {
        byte = this.readBytes(1);
        if (byte === '\x01') {
          version = this.readBytesUntil('\x02');
          console.log("version:", version);
        }
      }
      return true;
    };

    Importer.prototype.readBytes = function(count) {
      var bytes;
      bytes = this.data.slice(0, count);
      this.data = this.data.slice(count);
      return bytes;
    };

    Importer.prototype.readBytesUntil = function(findChar) {
      var byte, bytes, i, _i, _ref1;
      bytes = '';
      for (i = _i = 0, _ref1 = this.data.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        byte = this.data[i];
        if (byte !== findChar) {
          bytes += byte;
        }
      }
      return bytes;
    };

    return Importer;

  })();

}).call(this);
