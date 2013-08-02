(function() {
  var JSONExporter, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.JSONExporter = JSONExporter = (function() {

    function JSONExporter() {}

    JSONExporter.prototype.exportJSON = function(filename, appActions) {
      var action, actions, appAction, fileContent, i, jsonString, url;
      actions = [];
      for (i in appActions) {
        appAction = appActions[i];
        action = {
          x: appAction.x,
          y: appAction.y,
          width: appAction.width,
          index: appAction.index,
          type: appAction.type,
          parameters: appAction.parameters
        };
        console.log(appAction.type);
        actions.push(action);
      }
      fileContent = {
        version: Webbzeug.Version,
        ID: "Webbzeug file",
        actions: actions
      };
      jsonString = JSON.stringify(fileContent);
      url = "data:application/octet-stream;base64," + Base64.encode(jsonString);
      if (url != null) {
        return downloadDataURI({
          filename: filename,
          data: url
        });
      }
    };

    return JSONExporter;

  })();

}).call(this);
