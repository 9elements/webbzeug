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
      this.data = data;
      this.maxIndex = 0;
      return this.app.incrementalIndex = this.maxIndex + 1;
    };

    return JSONImporter;

  })();

}).call(this);
