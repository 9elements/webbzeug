(function() {
  var JSONImporter, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.JSONImporter = JSONImporter = (function() {

    JSONImporter.prototype.debug = true;

    function JSONImporter(app) {
      this.app = app;
      return;
    }

    JSONImporter.prototype.loadData = function(data) {
      var b64encodedData, decodedData, splitData;
      splitData = data.split('base64,');
      b64encodedData = splitData[1];
      data = Base64.decode(b64encodedData);
      decodedData = JSON.parse(data);
      if (this.fileVersionNewer(decodedData.version)) {
        alert('This file has been created with a newer version of webbzeug! (' + decodedData.version + ' > ' + Webbzeug.Version);
        return;
      }
      return this.extractData(decodedData.actions);
    };

    JSONImporter.prototype.extractData = function(data) {
      var action, actions, i;
      this.maxIndex = 0;
      actions = data;
      for (i in actions) {
        action = actions[i];
        console.log(action.type);
        this.extractAction(action);
      }
      return this.app.incrementalIndex = this.maxIndex + 1;
    };

    JSONImporter.prototype.extractAction = function(action) {
      var appAction, el;
      el = this.app.newActionElement(action.x * this.app.gridWidth, action.y * this.app.gridHeight, Webbzeug.ClassMap[action.type].name, action.width, Webbzeug.ClassMap[action.type].type);
      appAction = this.app.applyActionToElement(action.type, action.x, action.y, action.width, action.index, el);
      appAction.parameters = action.parameters;
      console.log(action.parameters);
      return this.maxIndex = Math.max(action.index, this.maxIndex);
    };

    JSONImporter.prototype.fileVersionNewer = function(fileVersion) {
      var i, nLen, nP1, nP2, nRes, parts1, parts2;
      nRes = 0;
      parts1 = Webbzeug.Version.split(".");
      parts2 = fileVersion.split(".");
      nLen = Math.max(parts1.length, parts2.length);
      i = 0;
      while (i < nLen) {
        nP1 = (i < parts1.length ? parseInt(parts1[i], 10) : 0);
        nP2 = (i < parts2.length ? parseInt(parts2[i], 10) : 0);
        if (isNaN(nP1)) {
          nP1 = 0;
        }
        if (isNaN(nP2)) {
          nP2 = 0;
        }
        if (nP1 !== nP2) {
          nRes = (nP1 > nP2 ? 1 : -1);
          break;
        }
        i++;
      }
      if (nRes === -1) {
        return true;
      } else {
        return false;
      }
    };

    return JSONImporter;

  })();

}).call(this);
