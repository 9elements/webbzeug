(function() {
  var _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.Utilities = {
    getDict: function() {
      var dict;
      dict = [];
      dict[0] = '';
      dict[1] = 'blur';
      dict[2] = 'cell';
      dict[3] = 'circle';
      dict[4] = 'combine';
      dict[5] = 'contbri';
      dict[6] = 'flat';
      dict[7] = 'fractal';
      dict[8] = 'invert';
      dict[9] = 'light';
      dict[10] = 'load';
      dict[11] = 'mirror';
      dict[12] = 'pixels';
      dict[13] = 'rectangle';
      dict[14] = 'rotozoom';
      dict[15] = 'save';
      dict[16] = 'roughness';
      dict[17] = 'seed';
      dict[18] = 'type';
      dict[19] = 'add';
      dict[20] = 'multiply';
      dict[21] = 'substract';
      dict[22] = 'contrast';
      dict[23] = 'brightness';
      dict[24] = 'strength';
      dict[25] = 'radius';
      dict[26] = 'color';
      dict[27] = 'id';
      dict[28] = 'width';
      dict[29] = 'height';
      dict[30] = 'x';
      dict[31] = 'y';
      dict[32] = 'radiusX';
      dict[33] = 'rotation';
      dict[34] = 'zoom';
      dict[35] = 'direction';
      dict[36] = 'horizontal';
      dict[37] = 'vertical';
      dict[38] = 'substract';
      dict[38] = 'add';
      return dict;
    },
    stringToByte: function(string) {
      var dict, dictMap, index, value, _i, _len;
      dict = this.getDict();
      dictMap = {};
      for (index = _i = 0, _len = dict.length; _i < _len; index = ++_i) {
        value = dict[index];
        dictMap[value] = index;
      }
      if (dictMap[string]) {
        return dictMap[string];
      }
      return string;
    },
    bytesToString: function(bytes) {
      var dict, intBytes;
      dict = this.getDict();
      intBytes = parseInt(bytes);
      if (dict[intBytes]) {
        return dict[intBytes];
      }
      return bytes;
    },
    versionToInt: function(version) {
      var i, versionInt, versionPart, versionSplit, _i, _ref1;
      versionSplit = version.split('.');
      versionInt = 0;
      for (i = _i = _ref1 = versionSplit.length - 1; _ref1 <= 0 ? _i < 0 : _i > 0; i = _ref1 <= 0 ? ++_i : --_i) {
        versionPart = versionSplit[i];
        versionInt += (versionSplit.length - i) * versionPart;
      }
      return versionInt;
    }
  };

}).call(this);
