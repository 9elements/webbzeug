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
      return this.extractData(decodedData);
    };

    JSONImporter.prototype.extractData = function(data) {
      var action, actions, i;
      this.maxIndex = 0;
      actions = data;
      for (i in actions) {
        action = actions[i];
        this.extractAction(action);
      }
      return this.app.incrementalIndex = this.maxIndex + 1;
    };

    JSONImporter.prototype.extractAction = function(action) {
      var el;
      console.log(action);
      el = this.app.newActionElement(action.x * this.app.gridWidth, action.y * this.app.gridHeight, Webbzeug.ClassMap[action.type].name, action.width, Webbzeug.ClassMap[action.type].type);
      this.app.applyActionToElement(action.type, action.x, action.y, action.width, action.index, el);
      return this.maxIndex = Math.max(action.index, this.maxIndex);
    };

    return JSONImporter;

  })();

}).call(this);
