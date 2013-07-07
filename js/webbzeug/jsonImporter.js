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
      var actions, b64encodedData, splitData;
      splitData = data.split('base64,');
      b64encodedData = splitData[1];
      data = Base64.decode(b64encodedData);
      actions = JSON.parse(data);
      return console.log(actions);
    };

    return JSONImporter;

  })();

}).call(this);
