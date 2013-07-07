(function() {
  var JSONExporter, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.JSONExporter = JSONExporter = (function() {

    function JSONExporter() {}

    JSONExporter.prototype.exportJSON = function(filename, appActions) {
      var action, actions, appAction, i, jsonString;
      actions = [];
      for (i in appActions) {
        appAction = appActions[i];
        action = {
          x: appAction.x,
          y: appAction.y,
          width: appAction.width,
          index: appAction.index,
          type: Webbzeug.Utilities.stringToByte(appAction.type),
          parameters: appAction.parameters
        };
        actions.push(action);
      }
      jsonString = JSON.stringify(actions);
      return console.log(jsonString);
    };

    return JSONExporter;

  })();

}).call(this);
